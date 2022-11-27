pool = require.main.pool;

module.exports.makeQuery = ({ query, single, callback }) => {
	if(typeof callback !== "undefined") {
		pool.connect((err, client, done) => {
			if (err) throw err;
			client.query(query, (err, res) => {
				done();
				if(err) {
					callback(err, undefined);
				} else {
					if(single) {
						callback(undefined, res.rows[0]);
					} else {
						callback(undefined, res.rows);
					}
				}
			})
		})
	} else {
		return new Promise(async (resolve, reject) => {
			try {
				client = await pool.connect();
				try {
					if (client) {
						res = await client.query(query);
						client.release();
						client = undefined;
						if(single) {
							resolve(res.rows[0]);
						} else {
							resolve(res.rows);
						}
					} else {
						console.log(query);
						throw "err";
					}
				} catch (err) {
					if(client) {
						client.release();
					}
					throw (err);
				}
			} catch (err) {
				reject(err);
			}
		});
	}
}