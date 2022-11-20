pool = require.main.pool;
const fs = require('fs');


deletePostPicture = (post) => {
	if(post && post.picture_filename.length > 0) {
		fs.unlink(`./uploads/${post.picture_filename}`, (err) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		});
	}
}

getPostById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where post_id = $1 and deleted = FALSE', [id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

createPost = ({user_id, category_id, title, description, price, address, picture_filename}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('insert into posts(user_id, category_id, title, description, price, address, picture_filename, publication_timestamp) values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *',
		[user_id, category_id, title, description, price, address, picture_filename, Date.now()/1000], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

deletePostById = (post_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('update posts set deleted=TRUE where post_id = $1 returning *', [post_id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

deletePostsByUserId = (user_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('update posts set deleted=TRUE where user_id = $1 returning *', [user_id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
			}
		})
	});
}

getAllPosts = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE', [], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
			}
		})
	});
}

getPostsByCategory = (category_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE and category_id = $1', [category_id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
			}
		})
	});
}

getPostsByUserId = (user_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE and user_id = $1', [user_id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
			}
		})
	});
}

getPostsByUserIdAndCategory = (user_id, category_id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from posts where deleted = FALSE and user_id = $1 and category_id = $2', [user_id, category_id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
			}
		})
	});
}

getCategoryById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from categories where category_id = $1', [id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

getAllCategories = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from categories', [], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
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
	getPostsByUserId,
	getPostsByCategory,
	getPostsByUserIdAndCategory,
	deletePostPicture,
	deletePostsByUserId
}