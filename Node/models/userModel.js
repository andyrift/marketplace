pool = require.main.pool;

getUserById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from users where user_id = $1 and deleted = FALSE', [id], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, user: qres.rows[0] });
			}
		})
	});
}

getAllUsers = (callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('select * from users where deleted = FALSE', [], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, users: qres.rows });
			}
		})
	});
}

createUser = ({username, displayname, password, email, address}, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query(
			'insert into users(role_id, username, display_name, password_hash, email, avatar_link, address) values($1, $2, $3, $4, $5, $6, $7) returning *',
		 [1, username, displayname, password, email, "", address], (qerr, qres) => {
			done();
			if(!qres){
				callback({ qerr: qerr });
			} else {
				callback({ qerr: qerr, user: qres.rows[0] });
			}
		})
	});
}



module.exports = {
	getUserById,
	createUser,
	getAllUsers
}