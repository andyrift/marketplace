const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");

module.exports.requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SECRET, (err, tokenDecoded) => {
			if (err) {
				console.log(err);
				res.redirect('/login');
			} else {
				//console.log(tokenDecoded);
				next();
			}
		});
	} else {
		res.redirect('/login');
	}
}

module.exports.checkUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SECRET, async (err, tokenDecoded) => {
			if (err) {
				console.log(err);
				res.locals.user = null;
				next();
			} else {
				user = await userModel.getUserById(tokenDecoded.user_id)
				res.locals.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
}

module.exports.checkAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SECRET, (err, tokenDecoded) => {
			if (err) {
				console.log(err);
				req.userInfo = null;
				next();
			} else {
				req.userInfo = { user_id:tokenDecoded.user_id, username:tokenDecoded.username };
				next();
			}
		});
	} else {
		req.userInfo = null;
		next();
	}
}