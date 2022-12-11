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

module.exports.checkAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SECRET, async (err, tokenDecoded) => {
			if (err) {
				console.log(err);
				res.locals.user = null;
				req.userInfo = null;
				next();
			} else {
				user = await userModel.getUserById({ user_id: tokenDecoded.user_id })
				if (!user) {
					res.locals.user = null;
					req.userInfo = null;
					next();
				} else {
					res.locals.user = user;
					req.userInfo = { user_id: user.user_id, username: user.username };
					next();
				}
			}
		});
	} else {
		res.locals.user = null;
		req.userInfo = null;
		next();
	}
}