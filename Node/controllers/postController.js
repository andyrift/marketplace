pool = require.main.pool;

createPost_get = (req, res) => {
	res.render('createpost', { title: 'Create' });
}

createPost_post = (req, res) => {
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query('insert into posts(user_id, category_id, title, description, price, address) values($1, $2, $3, $4, $5, $6)',
		[2, 1, req.body.title, req.body.description, req.body.price, req.body.address], (err, qres) => {
			done();
			if (err) {
				console.error('Error executing query', err.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				console.log('succesfully added post');
				res.redirect('/');
			}
		})
	});
}

post_get = (req, res) => {
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query('SELECT * FROM posts where post_id = $1 and deleted = FALSE', [req.params.id], (err, qres) => {
			done();
			if (err) {
				console.error('Error executing query', err.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				if(qres.rows.length > 0){
					res.render('post', { title: 'Post', post: qres.rows[0] });
				} else{
					res.status(404).render('404', { title: 'Not Found' });
				}
			}
		})
	});
}

post_delete = (req, res) => {
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query('update posts set deleted=TRUE where post_id = $1', [req.params.id], (err, qres) => {
			done();
			if (err) {
				console.error('Error executing query', err.stack);
				res.status(500).render('500', { title: 'Error' });
			} else {
				console.log('successfully deleted post');
				res.json({ redirect: '/' })
			}
		})
	});
}

allPosts_get = (req, res) => {
	
}

module.exports = {
	createPost_get,
	createPost_post,
	post_get,
	post_delete
}