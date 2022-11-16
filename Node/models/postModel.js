pool = require.main.pool;

getPostById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('SELECT * FROM posts where post_id = $1 and deleted = FALSE', [id], (qerr, qres) => {
			done();
			callback({ qerr: qerr, post: qres.rows[0] });
		})
	});
}

createPost = ({user_id, category_id, title, description, price, address}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('insert into posts(user_id, category_id, title, description, price, address) values($1, $2, $3, $4, $5, $6)',
		[user_id, category_id, title, description, price, address], (qerr, qres) => {
			done();
			callback({ qerr: qerr });
		})
	});
}

deletePostById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('update posts set deleted=TRUE where post_id = $1', [id], (qerr, qres) => {
			done();
			callback({ qerr: qerr });
		})
	});
}

getAllPosts = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('SELECT * FROM posts where deleted = FALSE', [], (qerr, qres) => {
			done();
			callback({ qerr: qerr, posts: qres.rows });
		})
	});
}

getAllCategories = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('SELECT * FROM categories', [], (qerr, qres) => {
			done();
			callback({ qerr: qerr, categories: qres.rows });
		})
	});
}

module.exports = {
	getPostById,
	createPost,
	deletePostById,
	getAllPosts,
	getAllCategories
}