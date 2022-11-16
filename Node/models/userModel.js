pool = require.main.pool;

getUserById = (id, callback) => {
	pool.connect((cerr, client, done) => {
		if (cerr) throw cerr;
		client.query('SELECT * FROM users where user_id = $1 and deleted = FALSE', [id], (qerr, qres) => {
			done();
			callback({ qerr: qerr, user: qres.rows[0] });
		})
	});
}

module.exports = {
	getUserById
}