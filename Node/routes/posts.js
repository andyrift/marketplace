const express = require('express');

const router = express.Router();

pool = module.parent.pool;
NotFound = module.parent.NotFound;

router.get('/create', (req, res) => {
	res.render('createpost', { title: 'Create' });
});

router.post('/create', (req, res) => {
	console.log(req.body);
	pool
		.query(
			'insert into posts(user_id, category_id, title, description, price, address) values($1, $2, $3, $4, $5, $6)',
		 [2, 1, req.body.title, req.body.description, req.body.price, req.body.address])
		.then(qres => {
			console.log('succesfully added post');
			res.redirect('/');
		})
		.catch(qerr => console.error('Error executing query', qerr.stack));
});

router.get('/:id', (req, res) => {
	pool
		.query('SELECT * FROM posts where post_id = $1', [req.params.id])
		.then(qres => {
			if(qres.rows.length > 0 && !qres.rows[0].deleted){
				console.log('query result:', qres.rows[0]);
				res.render('post', { title: 'Post', post: qres.rows[0] });
			} else{
				NotFound(req, res);
			}
		})
		.catch(qerr => {
			console.error('Error executing query', qerr.stack);
			NotFound(req, res);
		});
});

router.delete('/:id', (req, res) => {
	pool
		.query('update posts set deleted=TRUE where post_id = $1', [req.params.id])
		.then(qres => {
			console.log('successfully deleted post');
			res.json({ redirect: '/' })
		})
		.catch(qerr => {
			console.error('Error executing query', qerr.stack);
		});;
});

module.exports = router;