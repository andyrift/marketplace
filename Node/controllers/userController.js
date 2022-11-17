pool = require.main.pool;

userModel = require("../models/userModel");

const _ = require('lodash');

user_get = (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
    res.status(404).render('404', { title: 'User Not Found' });
  } else {
		userModel.getUserById(parseInt(req.params.id), ({ qerr, user }) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else if(user) {
				res.render('profile', { title: 'Profile', user: user });
			} else{
				res.status(404).render('404', { title: 'User Not Found' });
			}
		});
	}
}

module.exports = {
	user_get
}