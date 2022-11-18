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

user_post = (req, res) => {
	userModel.createUser({
		username: req.body.username, 
		displayname: req.body.displayname, 
		password: req.body.password, 
		email: req.body.email, 
		address: req.body.address
	}, ({ qerr, user }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else if(user) {
			res.redirect(`/profile/${user.user_id}`);
		} else{
			res.status(500).render('500', { title: 'Error' });
		}
	});
}

createUsers = () => {
	for (let i = 0; i < 100; i++) {
		userModel.createUser({
			username: (_.sample(require.main.words)), 
			displayname: _.startCase(_.sample(require.main.words) + " " + _.sample(require.main.words)), 
			password: Math.random().toString(36).slice(2), 
			email: _.sample(require.main.words) + "@gmail.com", 
			address: _.capitalize(_.sample(require.main.words)) + " City, " + _.capitalize(_.sample(require.main.words)) + " Street, " + _.random(0, 9999).toString(),
		}, ({ qerr, user }) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
			}
			console.log(user);
		});
	}
}

module.exports = {
	user_get,
	user_post
}