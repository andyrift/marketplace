const userModel = require("../models/userModel");
const fileModel = require("../models/fileModel");
const fetchError = require("./fetchError");
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const _ = require('lodash');
const bcrypt = require('bcrypt');

module.exports.signup_get = (req, res) => {
	res.render('signup', { title: 'Sign up' });
}

module.exports.login_get = (req, res) => {
	res.render('login', { title: 'Log in' });
}

module.exports.logout_get = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 });
	res.redirect('/');
}

containsSpecialChars = (str) => {
  const specialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

const checkInputsSignUp = (inputs, user) => {
	let errors = { username: undefined, password: undefined, email: undefined, address: undefined, picture: undefined, displayname: undefined };
	let pass = true;
	if (user || !inputs.username || inputs.username.length < 4 || containsSpecialChars(inputs.username)) {
		errors.username = "Please enter a valid username";
		pass = false;
	}
	if (!inputs.password || inputs.password.length < 6) {
		errors.password = "Please enter a valid password";
		pass = false;
	}
	if (!inputs.displayname) {
		errors.displayname = "Please enter a valid displayname";
		pass = false;
	}
	return { pass, errors };
}

const maxJwtAgeSeconds = 3 * 24 * 60 * 60;

const createToken = ({ user_id, username }) => {
	return jwt.sign({ user_id, username }, process.env.SECRET, { expiresIn: maxJwtAgeSeconds });
}

module.exports.signup_post = async (req, res) => {
	try {
		if(req.headers['content-type'].split(';')[0] === "multipart/form-data") {
			require.main.upload.single('picture')(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
		     	console.error('Multer error', err.stack);
					fetchError.sendError(res);
		    } else if (err) {
		      console.error('Unknown error', err);
					fetchError.sendError(res);
		    } else {
		    	user = await userModel.getUserByUsernameAny({ username: req.body.username });
		    	check = checkInputsSignUp(req.body, !!user);
					if (user || !check.pass) {
						if(req.file) {
							await fileModel.deleteFile(req.file.filename);
						}
						res.status(200).json({ errors: check.errors });
					} else {
						try {
							const password = await userModel.hashPassword(req.body.password);
							user = await userModel.createUser({
								username: req.body.username, 
								displayname: req.body.displayname, 
								password: password, 
								email: req.body.email, 
								address: req.body.address,
								picture_filename: req.file ? req.file.filename : "",
							});
							token = createToken({ user_id: user.user_id, username: user.username });
							res.cookie('jwt', token, { httpOnly: true, maxAge: maxJwtAgeSeconds * 1000 });
							res.status(201).json({ redirect: `/profile` });
						} catch {
							if(req.file) {
								await fileModel.deleteFile(req.file.filename);
							}
							throw "Could not create user";
						}
					}
				}
			});
		} else {
			throw "Unhandled request";
		}
	} catch(err) {
		console.error('Error while creating user', err);
		fetchError.sendError(res);
	}
}

module.exports.login_post = async (req, res) => {
	let errors = { username: undefined, password: undefined };
	try {
		user = await userModel.getUserByUsername({ username: req.body.username });
		if(user) {
			if (req.body.password && user.password) {
				auth = await bcrypt.compare(req.body.password, user.password);
				if (auth) {
					token = createToken({ user_id: user.user_id, username: user.username });
					res.cookie('jwt', token, { httpOnly: true, maxAge: maxJwtAgeSeconds * 1000 });
					res.status(200).json({ redirect: `/profile` });
				} else {
					errors.password = "Wrong password";
					res.status(200).json({ errors });
				}
			} else {
				errors.password = "Wrong password";
				res.status(200).json({ errors });
			}
		} else {
			errors.username = "No such user";
			res.status(200).json({ errors });
		}
	} catch (err) {
		console.error('Error while logging user in', err);
		fetchError.sendError(res);
	}
}