pool = require.main.pool;

postModel = require("../models/postModel");
userModel = require("../models/userModel");

const _ = require('lodash'); 

createPost_get = (req, res) => {
	res.render('createpost', { title: 'Create' });
}

createPost_post = (req, res) => {
	postModel.createPost({
		user_id: 2, 
		category_id: parseInt(req.body.category), 
		title: req.body.title, 
		description: req.body.description, 
		price: req.body.price, 
		address: req.body.address
	}, ({ qerr }) => {
		if (qerr) {
			console.error('Error executing query', err.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			console.log('succesfully added post');
			res.redirect('/');
		}
	});
}

post_get = (req, res) => {
	postModel.getPostById(req.params.id, ({ qerr, post }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			if(post){
				userModel.getUserById(post.user_id, ({ qerr, user }) => {
					if(user){
						postModel.getCategoryById(post.category_id, ({ qerr, category }) => {
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
	/*
	//delete all posts
	postModel.getAllPosts(({ qerr, posts }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
		} else {
			posts.forEach(post => {
				postModel.deletePostById(post.post_id, ({ qerr }) => {
					if (qerr) {
						console.error('Error executing query', qerr.stack);
					}
				});
			})
		}
	});
	//*/
}

post_delete = (req, res) => {
	postModel.deletePostById(req.params.id, ({ qerr, post }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			console.log('successfully deleted post');
			res.json({ redirect: '/' })
		}
	});
}

allPosts_get = (req, res) => {
	postModel.getAllPosts(({ qerr, posts }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			res.render('index', { title: 'Home', posts: posts });
		}
	});
}

severalPosts_post = (req, res) => {
	postModel.getAllPosts(({ qerr, posts }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {

			var resultPosts = [];

			posts=_.shuffle(posts);

			posts.every(post => {
				if (!req.body.postIds.includes(post.post_id)) {
					resultPosts.push(post);
				}
				if (resultPosts.length == req.body.quantity) {
					return false;
				}
				return true;
			});

			res.json({ posts: resultPosts })
		}
	});
}

allCategories_get = (req, res) => {
	postModel.getAllCategories(({ qerr, categories }) => {
		if (qerr) {
			console.error('Error executing query', qerr.stack);
			res.status(500).render('500', { title: 'Error' });
		} else {
			res.json({ categories: categories })
		}
	});
	/*
	for (let i = 0; i < 10000; i++) {
		postModel.createPost({
			user_id: 2, 
			category_id: _.random(1, 12),
			title: `${Math.random().toString(36).slice(2)} ${Math.random().toString(36).slice(2)}`, 
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim enim. Nunc eget lorem dolor sed viverra. Aliquet risus feugiat in ante. Egestas diam in arcu cursus euismod quis viverra nibh cras.", 
			price: `${_.random(0, 9999)}`, 
			address: `${Math.random().toString(36).slice(2)} ${_.random(0, 999)} ${Math.random().toString(36).slice(2)} ${_.random(0, 999)}`
		}, ({ qerr }) => {
			if (qerr) {
				console.error('Error executing query', qerr.stack);
			}
		});
	}
	//*/
}

module.exports = {
	createPost_get,
	createPost_post,
	post_get,
	post_delete,
	allPosts_get,
	severalPosts_post,
	allCategories_get
}