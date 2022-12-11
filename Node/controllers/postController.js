pool = require.main.pool;

postModel = require("../models/postModel");
userModel = require("../models/userModel");
favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");
fileModel = require("../models/fileModel");

const _ = require('lodash'); 
const multer  = require('multer');

getPosts = async (req, res) => {
	let readSize = 20;
	let {cursor, client} = {};
	if (req.query.category_id || req.query.string) {
		if(parseInt(req.query.category_id)) {
			({cursor, client} = await postModel.getPostsByCategoryCursorShuffle({
				closed: req.body.closed,
				category_id: parseInt(req.query.category_id)
			}));
		} else {
			({cursor, client} = await postModel.getAllPostsCursorShuffle({
				closed: req.body.closed
			}));
		}
	} else if(!req.body.username && !req.body.category_id) {
		if(req.body.shuffle) {
			({cursor, client} = await postModel.getAllPostsCursorShuffle({
				closed: req.body.closed
			}));
		} else {
			({cursor, client} = await postModel.getAllPostsCursor({
				closed: req.body.closed
			}));
		}
	} else if (!req.body.username) {
		if(req.body.shuffle) {
			({cursor, client} = await postModel.getPostsByCategoryCursorShuffle({ 
				closed: req.body.closed, 
				category_id: req.body.category_id 
			}));
		} else {
			({cursor, client} = await postModel.getPostsByCategoryCursor({ 
				closed: req.body.closed, 
				category_id: req.body.category_id 
			}));
		}
	} else if (!req.body.category_id) {
		user = await userModel.getUserByUsername({ username: req.body.username });
		if (!user) {
			res.status(200).json({ posts: [] });
			return;
		}
		if(req.body.shuffle) {
			({cursor, client} = await postModel.getPostsByUserIdCursorShuffle({ 
				closed: req.body.closed, 
				user_id: user.user_id 
			}));
		} else {
			({cursor, client} = await postModel.getPostsByUserIdCursor({ 
				closed: req.body.closed, 
				user_id: user.user_id 
			}));
		}
	} else {
		user = await userModel.getUserByUsername({ username: req.body.username });
		if (!user) {
			res.status(200).json({ posts: [] });
			return;
		}
		if(req.body.shuffle) {
			({cursor, client} = await postModel.getPostsByUserIdAndCategoryCursorShuffle({
				closed: req.body.closed, 
				user_id: user.user_id, 
				category_id: req.body.category_id 
			}));
		} else {
			({cursor, client} = await postModel.getPostsByUserIdAndCategoryCursor({
				closed: req.body.closed, 
				user_id: user.user_id, 
				category_id: req.body.category_id 
			}));
		}
	}

	if(!cursor) {
		if(client) {
			await client.release();
		}
		fetchError.sendError(res);
		return;
	}

	result = [];

	if (!req.body.quantity){
		await cursor.close();
		await client.release();
		res.status(200).json({ result });
		return;
	}

	rows = await cursor.read(readSize);
	while (rows.length) {
		if(result.length < req.body.quantity) {

			postModel.choosePosts({ 
				posts: rows, 
				excludePostIds: req.body.excludePostIds, 
				quantity: req.body.quantity - result.length,
				string: req.query.string
			}).forEach(post => {
				result.push(post);
			});

			rows = await cursor.read(readSize);
		} else {
			await cursor.close();
			break;
		}
	}
	await client.release();
	res.status(200).json({ result });
}

changeClosed = async (req, res) => {
	try {
		post = await postModel.getPostById({ post_id: parseInt(req.body.post_id) });
		if (post.user_id === req.userInfo.user_id) {
			closed = !!(post.closed);
			await postModel.setPostClosedById({ post_id: parseInt(req.body.post_id), closed: !closed });
			res.status(200).json({ redirect: undefined, closed: !closed });
		} else {
			fetchError.sendError(res);
		}
	} catch (err) {
		console.error("Error changing closed", err);
		fetchError.sendError(res);
	}
}

module.exports.post_post = (req, res) => {
	if (req.body.get) {
		getPosts(req, res);
	} else if (req.userInfo) {
		if (req.body.changeClosed) {
			changeClosed(req, res);
		}
	} else {
		fetchError.sendError(res);
	}
}

module.exports.createPost_get = (req, res) => {
	res.render('createpost', { title: 'Create' });
}

const checkInputsPost = (inputs) => {
	let errors = { title: undefined, price: undefined, picture: undefined };
	let pass = true;
	if (!inputs.title) {
		errors.title = "Please enter a valid title";
		pass = false;
	}
	if (!inputs.price || !Number.isInteger(parseInt(inputs.price))) {
		errors.price = "Please enter a valid price";
		pass = false;
	}
	return { pass, errors };
}

module.exports.createPost_post = async (req, res) => {
	try{
		if(req.headers['content-type'].split(';')[0] === "multipart/form-data"){
			require.main.upload.single('picture')(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
		     	console.error('Multer error', err.stack);
					fetchError.sendError(res);
		    } else if (err) {
		      console.error('Unknown error', err.stack);
					fetchError.sendError(res);
		    } else {
		    	check = checkInputsPost(req.body);
		    	if (!check.pass) {
						if(req.file) {
							await fileModel.deleteFile(req.file.filename);
						}
						res.status(200).json({ errors: check.errors });
					} else {
			    	try {
				    	post = await postModel.createPost({
								user_id: req.userInfo.user_id, 
								category_id: parseInt(req.body.category), 
								title: req.body.title, 
								description: req.body.description, 
								price: parseInt(req.body.price), 
								address: req.body.address,
								picture_filename: req.file ? req.file.filename : "",
							});
							if (post) {
								res.status(200).json({ redirect: `/post/${post.post_id}` });
							} else {
								throw new Error();
							}
						} catch {
							if(req.file) {
								await fileModel.deleteFile(req.file.filename);
							}
							throw "Could not create post";
						}
					}
		    }
		  });
		} else {
			throw "Unhandled request";
		}
	} catch {
		console.error('Error while creating post', err);
		fetchError.sendError(res);
	}
}

module.exports.updatePost_get = (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  res.status(404).render('404', { title: 'Post Not Found' });
	} else {
		postModel.getPostById({ post_id: parseInt(req.params.id) })
		.then(post => {
			if(!post){
				res.status(404).render('404', { title: 'Post Not Found' });
			} else if (post.user_id === req.userInfo.user_id) {
				res.render('updatepost', { title: 'Post', post: post });
			} else {
				res.status(500).render('500', { title: 'Error' });
			}
		})
		.catch(err => {
			console.error('Error getting updatepost', err);
			res.status(500).render('500', { title: 'Error' });
		});
	}
}

module.exports.updatePost_post = async (req, res) => {
	try {
		if (!_.isInteger(parseInt(req.params.id))) {
		  throw "Could not find post";
		} else if(req.headers['content-type'].split(';')[0] === "multipart/form-data") {
			require.main.upload.single('picture')(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
		     	console.error('Multer error', err.stack);
					fetchError.sendError(res);
		    } else if (err) {
		      console.error('Unknown error', err.stack);
					fetchError.sendError(res);
		    } else {
		    	check = checkInputsPost(req.body);
		    	if (!check.pass) {
						if(req.file) {
							await fileModel.deleteFile(req.file.filename);
						}
						res.status(200).json({ errors: check.errors });
					} else {
			    	post = await postModel.getPostById({ post_id: parseInt(req.params.id) });
			    	if(post && post.user_id === req.userInfo.user_id) {
					    if (req.file) {
								fileModel.deletePostPicture(post);
								try {
									post = await postModel.updatePostById_pic({
										category_id: parseInt(req.body.category), 
										title: req.body.title, 
										description: req.body.description, 
										price: parseInt(req.body.price), 
										address: req.body.address,
										picture_filename: req.file.filename,
										post_id: post.post_id
									});
									if (post) {
										res.status(200).json({ redirect: `/post/${post.post_id}` });
									}
									else {
										throw new Error();
									}
								} catch {
									await fileModel.deleteFile(req.file.filename);
									throw "Could not update post";
								}
							} else {
								post = await postModel.updatePostById_nopic({
										category_id: parseInt(req.body.category), 
										title: req.body.title, 
										description: req.body.description, 
										price: parseInt(req.body.price), 
										address: req.body.address,
										post_id: parseInt(req.params.id)
									});
								if (post) {
									res.status(200).json({ redirect: `/post/${post.post_id}` });
								}
								else {
									throw "Could not update post";
								}
					    }
					  } else {
					  	fetchError.sendError(res);
					  }
					}
			  }
		  });
		} else {
			throw "Unhandled request type";
		}
	} catch (err) {
		console.error(err);
		fetchError.sendError(res);
	}
}

module.exports.deletePicture_delete = async (req, res) => {
	try {
		post = await postModel.getPostById({ post_id: parseInt(req.params.id) });
		if (!post || req.userInfo.user_id !== post.user_id) {
			throw "no";
		}
		await fileModel.deletePostPicture(post);
		post = await postModel.deletePostPictureById({ post_id: parseInt(req.params.id) });
		res.status(200).json({});
	} catch (err) {
		console.error(err);
		res.status(400).json({});
	}
}

module.exports.post_get = async (req, res) => {
	if (!_.isInteger(parseInt(req.params.id))) {
	  res.status(404).render('404', { title: 'Post Not Found' });
	} else {
		try {
			post = await postModel.getPostByIdIncrementViews({ post_id: parseInt(req.params.id) });
			if (!post) {
				res.status(404).render('404', { title: 'Post Not Found' });
				return;
			}
			await postModel.updatePostFavoritesById({ post_id: post.post_id });
			owner = await userModel.getUserById({ user_id: post.user_id });
			if (!owner) {
				res.status(500).render('500', { title: 'Error' });
				return;
			}
			category = await postModel.getCategoryById({ category_id: post.category_id });
			if (!category) {
				res.status(500).render('500', { title: 'Error' });
				return;
			}
			let favorite = false;
			if (req.userInfo) {
				favorite = !!(await favoritesModel.getFavorite({ user_id: req.userInfo.user_id, post_id: post.post_id }));
			}
			res.render('post', { title: 'Post', post, owner, category, favorite });
		} catch (err) {
			console.error('Error getting post', err);
			res.status(500).render('500', { title: 'Error' });
		}
	}
}

deletePost = async (post) => {
	await fileModel.deletePostPicture(post);
	post = await postModel.deletePostById({ post_id: post.post_id });
	await postModel.clearPicture({ post_id: post.post_id });
	await favoritesModel.deleteFavoritesByPostId({ post_id: post.post_id });
	return post;
}

module.exports.post_delete = async (req, res) => {
	if (!_.isInteger(parseInt(req.params.id)) ) {
	  fetchError.sendError(res);
	} else {
		try {
			post = await postModel.getPostById({ post_id: parseInt(req.params.id) });
			if(post && req.userInfo.user_id === post.user_id) {
				await deletePost(post);
				res.json({ redirect: '/' });
			} else {
				throw "could not delete post";
			}
		} catch (err) {
			console.error('Error deleting post', err);
			fetchError.sendError(res);
		}
	}
}

module.exports.blockPost_post = async (req, res) => {
	if (!_.isInteger(parseInt(req.params.id)) ) {
	  fetchError.sendError(res);
	} else if (user.role_id === 2) {
		try {
			post = await postModel.getPostById({ post_id: parseInt(req.params.id) });
			await deletePost(post);
			res.status(200).json({ redirect: '/' });
		} catch(err) {
			console.error('Error while deleting user', err);
			fetchError.sendError(res);
		}
	} else {
		res.ststus(200).json({error: "You can't do that"})
	}
}

module.exports.allCategories_get = (req, res) => {
	postModel.getAllCategories((err, categories) => {
		if (err) {
			console.error('Error executing query', err.stack);
			fetchError.sendError(res);
		} else {
			res.status(200).json({ categories: categories })
		}
	});
}

module.exports.doStuff = async (req, res) => {
	//createPosts();
	//deleteAllPosts();
	//console.log('done');
	//closeSomePosts();
	res.redirect('/');
}

closeSomePosts = async () => {
	posts = await postModel.getAllPostsAny();
	for(const post of posts) {
		postModel.setPostClosedById({ post_id: post.post_id, closed: !!_.random(0, 2)})
	}
}

deleteAllPosts = async () => {
	console.log('deleting all posts');
	posts = await postModel.getAllPostsAny();
	for(const post of posts) {
		deletePost(post);
	}
}

var fs = require('fs');
var md5 = require('md5');

createPosts = () => {
	console.log('creating posts');
	
	var files = fs.readdirSync('./pictures');
	
	userModel.getAllUsers((err, users) => {
		if (err) {
			console.error('Error executing query', err.stack);
		} else {
			var allUserIds = [];
			users.forEach(user => {
				allUserIds.push({ user_id: user.user_id, username: user.username });
			});

			for (let i = 0; i < 1000; i++) {
				var myuser = _.sample(allUserIds)

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

				if (_.random(0, 100) > 10) {

					file = _.sample(files);

					filedir1 = `./pictures/${file}`;

					let ext = file.split('.')[file.split('.').length - 1];

					file = `${md5((Math.random().toString(36)+'00000000000000000').slice(2, 18))}-${Date.now()}.${ext}`;

					filedir2 = './uploads/' + file;

					fs.copyFileSync(filedir1, filedir2);

					postModel.createPost({
						user_id: myuser.user_id, 
						category_id: _.random(1, 12), 
						title: mytitle, 
						description: mydescr, 
						price: _.random(0, 9999), 
						address: users.find(user => {return (user.user_id === myuser.user_id)}).address,
						picture_filename: file,
					});
				} else {
					postModel.createPost({
						user_id: myuser.user_id, 
						category_id: _.random(1, 12), 
						title: mytitle, 
						description: mydescr, 
						price: _.random(0, 9999), 
						address: users.find(user => {return (user.user_id === myuser.user_id)}).address,
						picture_filename: "",
					});
				}
			}
		}
	});
	
}
