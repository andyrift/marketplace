pool = require.main.pool;

getPostById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where post_id = $1 and deleted = FALSE', [id], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, post: qres.rows[0] });
			}
		})
	});
}

createPost = ({user_id, category_id, title, description, price, address}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('insert into posts(user_id, category_id, title, description, price, address) values($1, $2, $3, $4, $5, $6) returning *',
		[user_id, category_id, title, description, price, address], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, post: qres.rows[0] });
			}
		})
	});
}

deletePostById = (post_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('update posts set deleted=TRUE where post_id = $1', [post_id], (qerr, qres) => {
			done();
			callback({ qerr: qerr });
		})
	});
}

getAllPosts = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE', [], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, posts: qres.rows });
			}
		})
	});
}

getPostsByCategory = (category_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE and category_id = $1', [category_id], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, posts: qres.rows });
			}
		})
	});
}

getPostsByUser = (user_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE and user_id = $1', [user_id], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, posts: qres.rows });
			}
		})
	});
}

getPostsByUserAndCategory = (user_id, category_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE and user_id = $1 and category_id = $2', [user_id, category_id], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, posts: qres.rows });
			}
		})
	});
}

getCategoryById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from categories where category_id = $1', [id], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, category: qres.rows[0] });
			}
		})
	});
}

getAllCategories = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from categories', [], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, categories: qres.rows });
			}
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
	getPostsByUser,
	getPostsByCategory,
	getPostsByUserAndCategory
}