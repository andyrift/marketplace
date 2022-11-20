pool = require.main.pool;

postModel = require("../models/postModel");
userModel = require("../models/userModel");

const _ = require('lodash'); 
const multer  = require('multer');
const fs = require('fs');

createPost_get = (req, res) => {
	res.render('createpost', { title: 'Create' });
}

createPost_post = (req, res) => {
	if(req.headers['content-type'].split(';')[0] === "multipart/form-data"){
		require.main.upload.single('picture')(req, res, (err) => {
			if (err instanceof multer.MulterError) {
	     	console.error('Multer error', err.stack);
				res.status(500).render('500', { title: 'Error' });
	    } else if (err) {
	      console.error('Unknown error', err.stack);
				res.status(500).render('500', { title: 'Error' });
	    } else {
	    	let filename = "";
				if(req.file){
					filename = req.file.filename;
				}
	    	postModel.createPost({
					user_id: 14, 
					category_id: parseInt(req.body.category), 
					title: req.body.title, 
					description: req.body.description, 
					price: req.body.price, 
					address: req.body.address,
					picture_filename: filename,
				}, (qerr, post) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
						if(req.file) {
							fs.unlink(`./uploads/${req.file.filename}`, (err) => {
							  if (err) {
							    console.error(err);
							    return;
							  }
							});
						}
						res.status(500).render('500', { title: 'Error' });
					} else {
						res.redirect(`/post/${post.post_id}`);
					}
				});
	    }
	  });
	}
}

post_get = (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  res.status(404).render('404', { title: 'Post Not Found' });
	} else {
		postModel.getPostById(parseInt(req.params.id), (qerr, post) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				if(post){
					userModel.getUserById(post.user_id, (qerr, user) => {
						if(user){
							postModel.getCategoryById(post.category_id, (qerr, category) => {
								if(category){
									res.render('post', { title: 'Post', post: post, user: user, category: category });
								} else{
									res.status(500).render('500', { title: 'Error' });
								}
							});
						} else{
							res.status(500).render('500', { title: 'Error' });
						}
					});
				} else {
					res.status(404).render('404', { title: 'Not Found' });
				}
			}
		});
	}
}

post_delete = (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  res.status(404).render('404', { title: 'Post Not Found' });
	} else {
		postModel.deletePostById(parseInt(req.params.id), (qerr, post) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				console.log('successfully deleted post');
				postModel.deletePostPicture(post);
				res.json({ redirect: '/' });
			}
		});
	}
}

allPosts_get = (req, res) => {
	postModel.getAllPosts((qerr, posts) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			res.render('index', { title: 'Home', posts: posts });
		}
	});
}

getPosts_post = (req, res) => {

	choosePosts = (posts, excludePostIds, quantity) => {

		if(!quantity){
			return [];
		}

		var resultPosts = [];

		posts=_.shuffle(posts);

		posts.every(post => {
			if (!excludePostIds || !excludePostIds.includes(post.post_id)) {
				resultPosts.push(post);
			}
			if (resultPosts.length == quantity) {
				return false;
			}
			return true;
		});

		return resultPosts;
	}

	if(!req.body.username && !req.body.category_id) {
		postModel.getAllPosts((qerr, posts) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				res.json({ posts: choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
			}
		});
	}	else if (!req.body.username) {
		postModel.getPostsByCategory(req.body.category_id, (qerr, posts) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				res.json({ posts: choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
			}
		});
	} else if (!req.body.category_id) {
		userModel.getUserByUsername(req.body.username, (qerr, user) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				postModel.getPostsByUserId(user.user_id, (qerr, posts) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
						res.status(500).render('500', { title: 'Error' });
					} else {
						res.json({ posts: choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
					}
				});
			}
		});
	} else {
		userModel.getUserByUsername(req.body.username, (qerr, user) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				postModel.getPostsByUserIdAndCategory(user.user_id, req.body.category_id, (qerr, posts) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
						res.status(500).render('500', { title: 'Error' });
					} else {
						res.json({ posts: choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
					}
				});
			}
		});
	}
}

allCategories_get = (req, res) => {
	postModel.getAllCategories((qerr, categories) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			res.json({ categories: categories })
		}
	});
}

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

module.exports = {
	createPost_get,
	createPost_post,
	post_get,
	post_delete,
	allPosts_get,
	getPosts_post,
	allCategories_get
}