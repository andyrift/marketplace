const md5 = require('md5');
const fs = require('fs');

pool = require.main.pool;

deleteUserPicture = (user) => {
	if(user && user.picture_filename.length > 0) {
		fs.unlink(`./uploads/${user.picture_filename}`, (err) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		});
	}
}

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

updateUserByUsername_pic = ({username, displayname, email, address, picture_filename}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query(
			'update users set displayname = $1, email = $2, picture_filename = $3, address = $4 where username = $5 returning *',
		 [displayname, email, picture_filename, address, username], (qerr, qres) => {
			done();
			if(qerr){
				callback( qerr, undefined );
			} else {
				callback( undefined, qres.rows[0] );
			}
		})
	});
}

updateUserByUsername_nopic = ({username, displayname, email, address, picture_filename}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query(
			'update users set displayname = $1, email = $2, address = $3 where username = $4 returning *',
		 [displayname, email, address, username], (qerr, qres) => {
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
	deleteUserByUsername,
	updateUserByUsername_pic,
	updateUserByUsername_nopic,
	deleteUserPicture
}