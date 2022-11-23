pool = require.main.pool;

getFavoritesByUserId = (id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select posts.user_id, posts.post_id, posts.category_id, posts.picture_filename, ' +
				'posts.price, posts.title, posts.description, posts.address, posts.publication_timestamp, ' +
				'posts.favorite_count, posts.view_count, posts.closed, posts.deleted ' + 
				'from posts, favorites where posts.deleted = FALSE and favorites.post_id = posts.post_id and favorites.user_id = $1', [id])
			.then(res => {
				client.release();
				resolve(res.rows);
				if(typeof callback !== "undefined") {
					callback(undefined, res.rows);
				}
			}).catch(err => {
				client.release();
				reject(err);
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}

addFavorite = ({ user_id, post_id }, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('insert into favorites(user_id, post_id) values($1, $2)', [user_id, post_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res);
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

getFavorite = ({ user_id, post_id }, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from favorites where user_id = $1 and post_id = $2', [user_id, post_id])
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

deleteFavorite = ({ user_id, post_id }, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('delete from favorites where user_id = $1 and post_id = $2', [user_id, post_id])
			.then(res => {
				client.release();
				if(typeof resolve !== "undefined") {
					resolve(res);
				}
				if(typeof callback !== "undefined") {
					callback(undefined, res);
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

deleteFavoritesByUserId = (user_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('delete from favorites where user_id = $1', [user_id])
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

deleteFavoritesByPostId = (post_id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('delete from favorites where post_id = $1', [post_id])
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
	getFavorite,
	addFavorite,
	deleteFavorite,
	getFavoritesByUserId,
	deleteFavoritesByUserId,
	deleteFavoritesByPostId
}