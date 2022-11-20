const md5 = require('md5');

pool = require.main.pool;

getUserById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from users where user_id = $1 and deleted = FALSE', [id], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

getUserByUsername = (username, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from users where username = $1 and deleted = FALSE', [username], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

getAllUsers = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from users where deleted = FALSE', [], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows );
			}
		})
	});
}

createUser = ({username, displayname, password, email, address, picture_filename}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query(
			'insert into users(role_id, username, displayname, password_hash, email, picture_filename, address, joined_timestamp) values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *',
		 [1, username, displayname, md5(password), email, picture_filename, address, Date.now()/1000], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

deleteUserByUsername = (username, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('update users set deleted=TRUE where username = $1 returning *', [username], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

module.exports = {
	getUserById,
	getUserByUsername,
	createUser,
	getAllUsers,
	deleteUserByUsername
}