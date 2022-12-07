pool = require.main.pool;

userModel = require("../models/userModel");
postModel = require("../models/postModel");
favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");
fileModel = require("../models/fileModel");

const _ = require('lodash');
const multer  = require('multer');

deleteUser = async (user) => {
	await fileModel.deleteUserPicture(user);
	user = await userModel.deleteUserByUsername({ username: user.username });
	await favoritesModel.deleteFavoritesByUserId({ user_id: user.user_id });
	await userModel.clearRating({ reciever_id: user.user_id });
	posts = await postModel.deletePostsByUserId({ user_id: user.user_id });
	for(const post of posts) {
		await fileModel.deletePostPicture(post);
		favoritesModel.deleteFavoritesByPostId({ post_id: post.post_id })
	}
	return user;
}

module.exports.user_get = (req, res) => {
	if (req.userInfo && req.params.username == req.userInfo.username) {
		res.redirect('/profile');
	} else {
		userModel.getUserByUsername({ username: req.params.username })
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
		user = await userModel.getUserById({ user_id: req.userInfo.user_id });
		console.log(await fileModel.deleteUserPicture(user));
		user = await userModel.deleteUserPictureById({ user_id: req.userInfo.user_id });
		res.status(200).json({});
	} catch (err) {
		console.error(err);
		res.status(400).json({});
	}
}

module.exports.profile_delete = async (req, res) => {
	try {
		user = await userModel.getUserById({ user_id: req.userInfo.user_id })
		user = await deleteUser(user);
		res.status(200).json({ redirect: '/logout' });
	} catch(err) {
		console.error('Error while deleting user', err);
		fetchError.sendError(res);
	}
}

module.exports.blockUser_post = async (req, res) => {
	user = await userModel.getUserById({ user_id: req.userInfo.user_id });
	if (user.role_id === 2) {
		try {
			user = await userModel.getUserByUsername({ username: req.params.username })
			user = await deleteUser(user);
			res.status(200).json({ redirect: '/' });
		} catch(err) {
			console.error('Error while deleting user', err);
			fetchError.sendError(res);
		}
	} else {
		res.ststus(200).json({error: "You can't do that"})
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
							await fileModel.deleteFile(req.file.filename);
						}
						res.status(200).json({ errors: { displayname: "Enter a valid displayname" } });
					} else if (req.file) {
						user = await userModel.getUserByUsername({ username: req.userInfo.username });
						if(user) {
							await fileModel.deleteUserPicture(user);
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
									await fileModel.deleteFile(req.file.filename);
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

module.exports.doStuff = async (req, res) => {
	//await createUsers();
	//updateRatings();
	//makeUpFavorites();
	//updateFavorites();
	res.redirect('/');
}

var fs = require('fs');
var md5 = require('md5');

updateFavorites = async () => {
	posts = await postModel.getAllPostsAny();
	posts.forEach(post => {
		postModel.updatePostFavoritesById({ post_id: post.post_id });
	});
}

makeUpFavorites = async () => {
	posts = await postModel.getAllPostsAny();
	console.log(posts);
	userModel.getAllUsers(async (err, users) => {
		for(const user of users) {
			if(_.random(0, 9) > 3) {
				for (let i = 0; i < _.random(0, 100); i++) {
					post_id = (_.sample(posts)).post_id;
					fav = await favoritesModel.getFavorite({ user_id: user.user_id, post_id: post_id});
					if(!fav) {
						await favoritesModel.addFavorite({ user_id: user.user_id, post_id: post_id});
					}
				}
			}
		}
	});
}

updateRatings = async () => {
	userModel.getAllUsers((err, users) => {
		users.forEach(async user => {
			rating = await userModel.calculateUserRating({
				reciever_id: parseInt(user.user_id),
			})
			await userModel.updateUserRating({ user_id: user.user_id, rating: rating.avg });
		});
	});
}

makeRatings = async () => {
	userModel.getAllUsers((err, users) => {
		users.forEach(sender => {
			if(_.random(0, 9) > 3) {
				for (let i = 0; i < _.random(0, 20); i++) {
					userModel.setRating({
						sender_id: sender.user_id,
						reciever_id: _.sample(_.filter( users, (o) => { return o !== user; })).user_id,
						rating: _.random(1, 5),
					})
				}
			}
		});
	});
}

createUsers = async () => {

	var files = fs.readdirSync('./pictures');

	for (let i = 0; i < 100; i++) {
		if (_.random(0, 100) > 40) {

			file = _.sample(files);

			filedir1 = `./pictures/${file}`;

			let ext = file.split('.')[file.split('.').length - 1];

			file = `${md5((Math.random().toString(36)+'00000000000000000').slice(2, 18))}-${Date.now()}.${ext}`;

			filedir2 = './uploads/' + file;

			fs.copyFileSync(filedir1, filedir2);

			userModel.createUser({
				username: (_.sample(require.main.words)), 
				displayname: _.startCase(_.sample(require.main.words) + " " + _.sample(require.main.words)), 
				password: '$2b$10$h7TWh0rJKLNhcWLRnCMGAug1OSCL8S9YGQys8mHslpNTX1tWpXy.G', 
				email: _.sample(require.main.words) + "@gmail.com", 
				address: _.capitalize(_.sample(require.main.words)) + " City, " + _.capitalize(_.sample(require.main.words)) + " Street, " + _.random(0, 9999).toString(),
				picture_filename: file,
			});
		} else {
			userModel.createUser({
				username: (_.sample(require.main.words)), 
				displayname: _.startCase(_.sample(require.main.words) + " " + _.sample(require.main.words)), 
				password: '$2b$10$h7TWh0rJKLNhcWLRnCMGAug1OSCL8S9YGQys8mHslpNTX1tWpXy.G', 
				email: _.sample(require.main.words) + "@gmail.com", 
				address: _.capitalize(_.sample(require.main.words)) + " City, " + _.capitalize(_.sample(require.main.words)) + " Street, " + _.random(0, 9999).toString(),
				picture_filename: "",
			});
		}
	}
	return true;
}
