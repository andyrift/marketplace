pool = require.main.pool;

userModel = require("../models/userModel");
postModel = require("../models/postModel");
favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");
fileModel = require("../models/fileModel");

const _ = require('lodash');
const multer  = require('multer');

module.exports.user_get = (req, res) => {
	if (req.userInfo && req.params.username == req.userInfo.username) {
		res.redirect('/profile');
	} else {
		userModel.getUserByUsername(req.params.username)
		.then(async (user) => {
			try {
				if (user) {
					if (req.userInfo) {
						rating = await userModel.getRating({ sender_id: req.userInfo.user_id, reciever_id: user.user_id })
						if(rating) {
							rating = rating.rating;
						}
						res.render('user', { title: 'User', owner: user, rating });
					} else {
						res.render('user', { title: 'User', owner: user, rating: undefined });
					}
				} else {
					res.status(404).render('404', { title: 'User Not Found' });
				}
			} catch(err) {
				console.error(err);
				res.status(500).render('500', { title: 'Error' });
			}
		})
		.catch(err => {
			console.error('Error while getting user', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		});
	}
}

module.exports.profile_get = (req, res) => {
	res.render('profile', { title: 'Profile' });
}

module.exports.updateProfile_get = async (req, res) => {
	res.render('updateuser', { title: 'Profile' });
}

module.exports.deletePicture_delete = async (req, res) => {
	try {
		user = await userModel.getUserById(req.userInfo.user_id);
		fileModel.deleteUserPicture(user);
		user = await userModel.deleteUserPictureById({ user_id: req.userInfo.user_id });
		res.status(200).json({});
	} catch (err) {
		console.error(err);
		res.status(400).json({});
	}
}

module.exports.profile_delete = async (req, res) => {
	try {
		user = await userModel.deleteUserByUsername(req.userInfo.username)
		fileModel.deleteUserPicture(user);
		await favoritesModel.deleteFavoritesByUserId(user.user_id);
		await userModel.clearRating({reciever_id: user.user_id});
		posts = await postModel.deletePostsByUserId(user.user_id);
		posts.forEach(post => {
			postModel.deletePostPicture(post);
		})
		res.status(200).json({ redirect: '/logout' });
	} catch(err) {
		console.error('Error while deleting user', err);
		fetchError.sendError(res);
	}
}

module.exports.updateProfile_post = async (req, res) => {
	try {
		if(req.headers['content-type'].split(';')[0] === "multipart/form-data"){
			require.main.upload.single('picture')(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
		     	console.error('Multer error', err.stack);
					fetchError.sendError(res);
		    } else if (err) {
		      console.error('Unknown error', err.stack);
					fetchError.sendError(res);
		    } else {
		    	if (!req.body.displayname) {
						if(req.file) {
							fileModel.deleteFile(req.file.filename);
						}
						res.status(200).json({ errors: { displayname: "Enter a valid displayname" } });
					} else if (req.file) {
						user = await userModel.getUserByUsername(req.userInfo.username);
						if(user) {
							fileModel.deleteUserPicture(user);
							try {
								user = await userModel.updateUserByUsername_pic({
									username: user.username,
									displayname: req.body.displayname,
									email: req.body.email, 
									address: req.body.address,
									picture_filename: req.file.filename,
								});
								if (user) {
									res.status(200).json({ redirect: `/profile` });
								} else {
									throw new Error();
								}
							} catch (err) {
								if(req.file) {
									fileModel.deleteFile(req.file.filename);
								}
								throw "Could not create user";
							}
						} else {
							throw "User not found";
						}
					} else {
						user = await userModel.updateUserByUsername_nopic({
							username: req.userInfo.username,
							displayname: req.body.displayname,
							email: req.body.email, 
							address: req.body.address,
						});
						if (user) {
							res.status(200).json({ redirect: `/profile` });
						} else {
							throw "Could not update user";
						}
					}
		    }
		  });
		} else {
			throw "Unhandled request";
		}
	} catch (err) {
		console.error('Error while deleting user', err);
		fetchError.sendError(res);
	}
}

module.exports.user_post = async (req, res) => {
	try {
		rating = await userModel.setRating({
			sender_id: req.userInfo.user_id,
			reciever_id: parseInt(req.body.user_id),
			rating: req.body.rating
		})
		rating = await userModel.calculateUserRating({
			reciever_id: parseInt(req.body.user_id),
		})
		await userModel.updateUserRating({ user_id: req.body.user_id, rating: rating.avg });
		console.log(rating);
		res.status(302).json({});
	} catch(err) {
		console.error(err);
		fetchError.sendError(res);
	}
}

/*
createUsers = () => {
	for (let i = 0; i < 100; i++) {
		userModel.createUser({
			username: (_.sample(require.main.words)), 
			displayname: _.startCase(_.sample(require.main.words) + " " + _.sample(require.main.words)), 
			password: Math.random().toString(36).slice(2), 
			email: _.sample(require.main.words) + "@gmail.com", 
			address: _.capitalize(_.sample(require.main.words)) + " City, " + _.capitalize(_.sample(require.main.words)) + " Street, " + _.random(0, 9999).toString(),
		}, (qerr, user) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
			}
		});
	}
}
*/