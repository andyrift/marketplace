pool = require.main.pool;

module.exports.makeQuery = ({ query, single, callback }) => {
	return new Promise((resolve, reject) => {
		pool.connect()
		.then(client => {
			client.query(query)
			.then(res => {
				console.log(res.rows, typeof resolve, typeof callback);
				client.release();
				if(single) {
					if (typeof resolve !== "undefined") {
						resolve(res.rows[0]);
					}
					if(typeof callback !== "undefined") {
						callback(undefined, res.rows[0]);
					}
				} else {
					if (typeof resolve !== "undefined") {
						resolve(res.rows);
					}
					if(typeof callback !== "undefined") {
						callback(undefined, res.rows);
					}
				}
			}).catch(err => {
				client.release();
				if (typeof reject !== "undefined") {
					reject(err);
				}
				if(typeof callback !== "undefined") {
					callback(err, undefined);
				}
			})
		})
	});
}