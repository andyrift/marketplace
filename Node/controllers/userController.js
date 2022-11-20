pool = require.main.pool;

userModel = require("../models/userModel");
postModel = require("../models/postModel");

const _ = require('lodash');
const multer  = require('multer');
const fs = require('fs');

user_get = (req, res) => {
	userModel.getUserByUsername(req.params.username, (qerr, user ) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else if (user) {
			res.render('profile', { title: 'Profile', user: user });
		} else{
			res.status(404).render('404', { title: 'User Not Found' });
		}
	});
}

updateUser_get = (req, res) => {
	userModel.getUserByUsername(req.params.username, (qerr, user ) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else if (user) {
			res.render('updateuser', { title: 'Profile', user: user });
		} else{
			res.status(404).render('404', { title: 'User Not Found' });
		}
	});
}

user_delete = (req, res) => {
	userModel.deleteUserByUsername(req.params.username, (qerr, user) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			console.log('successfully deleted user');
			postModel.deletePostsByUserId(user.user_id, (qerr, posts) => {
				if (qerr) {
					console.error('Error executing query', qerr.stack);
					res.status(500).render('500', { title: 'Error' });
				} else {
					posts.forEach(post => {
						postModel.deletePostPicture(post);
					})
				}
			});
			if(user && user.picture_filename.length > 0) {
				fs.unlink(`./uploads/${user.picture_filename}`, (err) => {
				  if (err) {
				    console.error(err);
				    return;
				  }
				});
			}
			res.json({ redirect: '/' });
		}
	});
}

containsSpecialChars = (str) => {
  const specialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

createUser_post = (req, res) => {
	if(req.headers['content-type'].split(';')[0] === "application/json") {
		userModel.getUserByUsername(req.body.username, (qerr, user ) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else if (user || containsSpecialChars(req.body.username)) {
				res.status(200).json({ usernameAccepted: false })
			} else {
				res.status(200).json({ usernameAccepted: true });
			}
		});
	} else if(req.headers['content-type'].split(';')[0] === "multipart/form-data"){
		require.main.upload.single('picture')(req, res, (err) => {
			if (err instanceof multer.MulterError) {
	     	console.error('Multer error', err.stack);
				res.status(500).render('500', { title: 'Error' });
	    } else if (err) {
	      console.error('Unknown error', err.stack);
				res.status(500).render('500', { title: 'Error' });
	    } else {
				userModel.getUserByUsername(req.body.username, (qerr, user ) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
						res.status(500).render('500', { title: 'Error' });
					} else if (user || containsSpecialChars(req.body.username)) {
						if(req.file){
							fs.unlink(`./uploads/${req.file.filename}`, (err) => {
							  if (err) {
							    console.error(err);
							    return;
							  }
							});
						}
						res.status(200).json({ usernameAccepted: false });
					} else {
						let filename = "";
						if(req.file){
							filename = req.file.filename;
						}
						userModel.createUser({
							username: req.body.username, 
							displayname: req.body.displayname, 
							password: req.body.password, 
							email: req.body.email, 
							address: req.body.address,
							picture_filename: filename,
						}, (qerr, user ) => {
							if (qerr) {
								console.error('Error executing query', qerr.stack);
								res.status(500).render('500', { title: 'Error' });
							} else if(user) {
								res.status(302).json({ usernameAccepted: true, redirect: `/profile/${user.username}` });
							} else {
								res.status(500).render('500', { title: 'Error' });
							}
						});
					}
				});
	    }
	  });
	} else {
		res.status(500).render('500', { title: 'Error' });
	}
}

updateUser_post = (req, res) => {
	if(req.headers['content-type'].split(';')[0] === "multipart/form-data"){
		require.main.upload.single('picture')(req, res, (err) => {
			if (err instanceof multer.MulterError) {
	     	console.error('Multer error', err.stack);
				res.status(500).render('500', { title: 'Error' });
	    } else if (err) {
	      console.error('Unknown error', err.stack);
				res.status(500).render('500', { title: 'Error' });
	    } else {
				if(req.file){
					userModel.getUserByUsername(req.params.username, (qerr, user ) => {
						if (qerr) {
							console.error('Error executing query', qerr.stack);
							res.status(500).render('500', { title: 'Error' });
						} else {
							userModel.deleteUserPicture(user);
							userModel.updateUserByUsername_pic({
								username: req.params.username,
								displayname: req.body.displayname,
								email: req.body.email, 
								address: req.body.address,
								picture_filename: req.file.filename,
							}, (qerr, user ) => {
								if (qerr) {
									console.error('Error executing query', qerr.stack);
									res.status(500).render('500', { title: 'Error' });
								} else {
									res.redirect(`/profile/${user.username}`);
								}
							});
						}
					});
				} else {
					userModel.updateUserByUsername_nopic({
						username: req.params.username,
						displayname: req.body.displayname,
						email: req.body.email, 
						address: req.body.address,
					}, (qerr, user ) => {
						if (qerr) {
							console.error('Error executing query', qerr.stack);
							res.status(500).render('500', { title: 'Error' });
						} else {
							res.redirect(`/profile/${user.username}`);
						}
					});
				}
	    }
	  });
	} else {
		res.status(500).render('500', { title: 'Error' });
	}
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
		});
	}
}

module.exports = {
	user_get,
	updateUser_get,
	createUser_post,
	updateUser_post,
	user_delete
}