pool = require.main.pool;

postModel = require("../models/postModel");
userModel = require("../models/userModel");
favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");
fileModel = require("../models/fileModel");

const _ = require('lodash'); 
const multer  = require('multer');

createPost_get = (req, res) => {
	res.render('createpost', { title: 'Create' });
}

createPost_post = async (req, res) => {
	try{
		if(req.headers['content-type'].split(';')[0] === "multipart/form-data"){
			require.main.upload.single('picture')(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
		     	console.error('Multer error', err.stack);
					res.status(500).render('500', { title: 'Error' });
		    } else if (err) {
		      console.error('Unknown error', err.stack);
					res.status(500).render('500', { title: 'Error' });
		    } else {
		    	try {
			    	post = await postModel.createPost({
							user_id: 19, 
							category_id: parseInt(req.body.category), 
							title: req.body.title, 
							description: req.body.description, 
							price: req.body.price, 
							address: req.body.address,
							picture_filename: req.file ? req.file.filename : "",
						});
						if (post) {
							res.status(302).redirect(`/post/${post.post_id}`);
						} else {
							throw new Error();
						}
					} catch {
						if(req.file) {
							fileModel.deleteFile(req.file.filename);
						}
						throw "Could not create post";
					}
		    }
		  });
		} else {
			throw "Unhandled request";
		}
	} catch {
		console.error('Error while creating post', err);
		res.status(500).render('500', { title: 'Error' });
	}
}

post_get = async (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  res.status(404).render('404', { title: 'Post Not Found' });
	} else {
		try {
			post = await postModel.getPostById(parseInt(req.params.id));
			if (!post) {
				res.status(404).render('404', { title: 'Post Not Found' });
			}
			user = await userModel.getUserById(post.user_id);
			if (!user) {
				res.status(500).render('500', { title: 'Error' });
			}
			category = await postModel.getCategoryById(post.category_id);
			if (!category) {
				res.status(500).render('500', { title: 'Error' });
			}
			res.render('post', { title: 'Post', post: post, user: user, category: category });
		} catch (err) {
			console.error('Error getting post', err);
			res.status(500).render('500', { title: 'Error' });
		}
	}
}

updatePost_get = (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  res.status(404).render('404', { title: 'Post Not Found' });
	} else {
		postModel.getPostById(parseInt(req.params.id))
		.then(post => {
			if(!post){
				res.status(404).render('404', { title: 'Post Not Found' });
			}
			res.render('updatepost', { title: 'Post', post: post });
		})
		.catch(err => {
			console.error('Error getting updatepost', err);
			res.status(500).render('500', { title: 'Error' });
		});
	}
}

post_delete = async (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  fetchError.sendError(res);
	} else {
		try {
			post = await postModel.deletePostById(parseInt(req.params.id));
			if (post) {
				await favoritesModel.deleteFavoritesByPostId(post.post_id);
				fileModel.deletePostPicture(post);
				res.json({ redirect: '/' });
			} else {
				throw "could not find post";
			}
		} catch (err) {
			console.error('Error deleting post', err);
			fetchError.sendError(res);
		}
	}
}

updatePost_post = async (req, res) => {
	try {
		if (!_.isInteger(parseInt(req.params.id))) {
		  throw "Could not find post";
		} else if(req.headers['content-type'].split(';')[0] === "multipart/form-data") {
			require.main.upload.single('picture')(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
		     	console.error('Multer error', err.stack);
					res.status(500).render('500', { title: 'Error' });
		    } else if (err) {
		      console.error('Unknown error', err.stack);
					res.status(500).render('500', { title: 'Error' });
		    } else if (req.file) {
					post = await postModel.getPostById(parseInt(req.params.id));
					if(post) {
						fileModel.deletePostPicture(post);
						try {
							post = await postModel.updatePostById_pic({
								category_id: parseInt(req.body.category), 
								title: req.body.title, 
								description: req.body.description, 
								price: req.body.price, 
								address: req.body.address,
								picture_filename: req.file.filename,
								post_id: post.post_id
							});
							if (post) {
								res.redirect(`/post/${post.post_id}`);
							}
							else {
								throw new Error();
							}
						} catch {
							fileModel.deleteFile(req.file.filename);
							throw "Could not update post";
						}
					}
				} else {
					post = await postModel.updatePostById_nopic({
							category_id: parseInt(req.body.category), 
							title: req.body.title, 
							description: req.body.description, 
							price: req.body.price, 
							address: req.body.address,
							post_id: parseInt(req.params.id)
						});
					if (post) {
						res.redirect(`/post/${post.post_id}`);
					}
					else {
						throw "Could not update post";
					}
		    }
		  });
		} else {
			throw "Unhandled request type";
		}
	} catch (err) {
		console.error(err);
		res.status(500).render('500', { title: 'Error' });
	}
}

getPosts_post = (req, res) => {
	if(!req.body.username && !req.body.category_id) {
		postModel.getAllPosts((qerr, posts) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				fetchError.sendError(res);
			} else {
				res.status(200).json({ posts: postModel.choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
			}
		});
	}	else if (!req.body.username) {
		postModel.getPostsByCategory(req.body.category_id, (qerr, posts) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				fetchError.sendError(res);
			} else {
				res.status(200).json({ posts: postModel.choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
			}
		});
	} else if (!req.body.category_id) {
		userModel.getUserByUsername(req.body.username, (qerr, user) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				fetchError.sendError(res);
			} else {
				postModel.getPostsByUserId(user.user_id, (qerr, posts) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
						fetchError.sendError(res);
					} else {
						res.status(200).json({ posts: postModel.choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
					}
				});
			}
		});
	} else {
		userModel.getUserByUsername(req.body.username, (qerr, user) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				fetchError.sendError(res);
			} else {
				postModel.getPostsByUserIdAndCategory(user.user_id, req.body.category_id, (qerr, posts) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
						fetchError.sendError(res);
					} else {
						res.status(200).json({ posts: postModel.choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
					}
				});
			}
		});
	}
}

allCategories_get = (req, res) => {
	postModel.getAllCategories((err, categories) => {
		if (err) {
			console.error('Error executing query', err.stack);
			fetchError.sendError(res);
		} else {
			res.status(200).json({ categories: categories })
		}
	});
}

/*
deleteAllPosts = () => {
	console.log('deleting all posts');
	postModel.getAllPosts((qerr, posts) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
		} else {
			posts.forEach(post => {
				postModel.deletePostById(post.post_id, (qerr, post) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
					}
				});
			})
		}
	});
}

createPosts = () => {
	console.log('creating posts');

	userModel.getAllUsers(({ qerr, users }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
		} else {
			var allUserIds = [];
			users.forEach(user => {
				allUserIds.push(user.user_id);
			});

			for (let i = 0; i < 500; i++) {
				var myuser_id = _.sample(allUserIds)

				var w = _.random(0, 7);
				var mytitle = _.capitalize(_.sample(require.main.words));
				for (let i = 0; i < w; i++) {
					if (_.random(0, 1)) { 
						mytitle = mytitle + " " + _.sample(require.main.words);
					} else{
						mytitle = mytitle + " " + _.capitalize(_.sample(require.main.words));
					}
				}

				var d = _.random(5, 100);
				var mydescr = _.capitalize(_.sample(require.main.words));
				for (let i = 0; i < d; i++) {
					if (_.random(0, 1)) { 
						mydescr = mydescr + " " + _.sample(require.main.words);
					} else{
						mydescr = mydescr + " " + _.capitalize(_.sample(require.main.words));
					}
				}
				postModel.createPost({
					user_id: myuser_id, 
					category_id: _.random(1, 12),
					title: mytitle, 
					description: mydescr, 
					price: `${_.random(0, 9999)}`,
					address: users.find(user => {return (user.user_id === myuser_id)}).address,
				}, ({ qerr, post}) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
					}
					console.log(post);
				});
			}
		}
	});
}
*/

module.exports = {
	createPost_get,
	createPost_post,
	updatePost_get,
	updatePost_post,
	post_get,
	post_delete,
	getPosts_post,
	allCategories_get,
}