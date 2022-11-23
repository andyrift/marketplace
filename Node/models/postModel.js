pool = require.main.pool;
const _ = require('lodash');

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

getPostById = (id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select posts.user_id, posts.post_id, posts.category_id, posts.picture_filename, ' +
				'posts.price, posts.title, posts.description, posts.address, posts.publication_timestamp, ' +
				'posts.favorite_count, posts.view_count, posts.closed, posts.deleted ' + 
				'from posts where post_id = $1 and deleted = FALSE', [id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows[0]);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows[0]);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

createPost = ({user_id, category_id, title, description, price, address, picture_filename}, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
				client.query('insert into posts(user_id, category_id, title, description, price, address, picture_filename, publication_timestamp) values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *',
				[user_id, category_id, title, description, price, address, picture_filename, Date.now()/1000])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows[0]);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows[0]);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

deletePostById = (post_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('update posts set deleted=TRUE where post_id = $1 returning *', [post_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows[0]);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows[0]);
				}
			}).catch(err => {
				console.error(err);
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

updatePostById_pic = ({post_id, category_id, title, description, price, address, picture_filename}, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('update posts set category_id=$1, title=$2, description=$3, price=$4, address=$5, picture_filename = $6 where post_id = $7 returning *', 
				[category_id, title, description, price, address, picture_filename, post_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows[0]);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows[0]);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

updatePostById_nopic = ({post_id, category_id, title, description, price, address}, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('update posts set category_id=$1, title=$2, description=$3, price=$4, address=$5 where post_id = $6 returning *', 
				[category_id, title, description, price, address, post_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows[0]);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows[0]);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

deletePostsByUserId = (user_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('update posts set deleted=TRUE where user_id = $1 returning *', [user_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

getAllPosts = (callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from posts where deleted = FALSE', [])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

getPostsByCategory = (category_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from posts where deleted = FALSE and category_id = $1', [category_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

getPostsByUserId = (user_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from posts where deleted = FALSE and user_id = $1', [user_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

getPostsByUserIdAndCategory = (user_id, category_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from posts where deleted = FALSE and user_id = $1 and category_id = $2', [user_id, category_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

getCategoryById = (id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from categories where category_id = $1', [id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows[0]);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows[0]);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

getAllCategories = (callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from categories', [])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res.rows);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				if(typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

module.exports = {
	getPostById,
	createPost,
	deletePostById,
	getAllPosts,
	getAllCategories,
	getCategoryById,
	getPostsByUserId,
	getPostsByCategory,
	getPostsByUserIdAndCategory,
	deletePostsByUserId,
	updatePostById_pic,
	updatePostById_nopic,
	choosePosts
}