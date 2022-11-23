const md5 = require('md5');

pool = require.main.pool;

getUserById = (id, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from users where user_id = $1 and deleted = FALSE', [id])
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

getUserByUsername = (username, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from users where username = $1 and deleted = FALSE', [username])
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

getAllUsers = (callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('select * from users where deleted = FALSE', [])
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

createUser = ({username, displayname, password, email, address, picture_filename}, callback) => {
	console.log('creating user');
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query(
				'insert into users(role_id, username, displayname, password_hash, email, picture_filename, address, joined_timestamp) values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *',
				[1, username, displayname, md5(password), email, picture_filename, address, Date.now()/1000])
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

updateUserByUsername_pic = ({username, displayname, email, address, picture_filename}, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query(
				'update users set displayname = $1, email = $2, picture_filename = $3, address = $4 where username = $5 returning *',
		 		[displayname, email, picture_filename, address, username])
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

updateUserByUsername_nopic = ({username, displayname, email, address}, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query(
				'update users set displayname = $1, email = $2, address = $3 where username = $4 returning *',
		 		[displayname, email, address, username])
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

deleteUserByUsername = (username, callback) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query('update users set deleted=TRUE where username = $1 returning *', [username])
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

module.exports = {
	getUserById,
	getUserByUsername,
	createUser,
	getAllUsers,
	deleteUserByUsername,
	updateUserByUsername_pic,
	updateUserByUsername_nopic,
}