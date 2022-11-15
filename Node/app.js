if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const morgan = require('morgan');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'views');

// pool uses environment variables for connection information

const { Pool } = require('pg');

module.pool = new Pool();

const postRoutes = require("./routes/posts.js")

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// listen
const port = 3000
app.listen(port);
console.log(`now listening on port ${port}`);

// middleware example

/*
app.use((req, res, next) => {
	console.log('new request made');
	console.log('host', req.hostname);
	console.log('path', req.path);
	console.log('method', req.method);
	next();
});
*/

// middleware & static files

app.use(express.static('static'))
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/register', (req, res) => {
	console.log(req.body);
	pool
		.query(
			'insert into users(role_id, username, display_name, password_hash, email, avatar_link, address) values($1, $2, $3, $4, $5, $6, $7)',
		 [1, req.body.username, req.body.displayname, req.body.password, req.body.email, "", req.body.address])
		.then(qres => {
			console.log('succesfully added user');
			res.redirect('/profile');
		})
		.catch(qerr => console.error('Error executing query', qerr.stack));
})

app.get('/', (req, res) => {
	//res.sendFile('./views/index.html', { root: __dirname });
	res.render('index', { title: 'Home' });
	
	pool
		.query('SELECT * FROM roles')
		.then(res => console.log('query result:', res.rows))
		.catch(err => console.error('Error executing query', err.stack))
});
app.get('/profile', (req, res) => {
	res.render('profile', { title: 'Profile' });
});
app.get('/register', (req, res) => {
	res.render('createuser', { title: 'Register' });
});
app.get('/login', (req, res) => {
	res.render('login', { title: 'Log in' });
});
app.get('/help', (req, res) => {
	res.render('help', { title: 'Help' });
});
app.get('/messages', (req, res) => {
	res.render('messages', { title: 'Messages' });
});
app.get('/dialogue', (req, res) => {
	res.render('dialogue', { title: 'Chat' });
});
app.get('/blacklist', (req, res) => {
	res.render('blacklist', { title: 'Blacklist' });
});
app.get('/favorites', (req, res) => {
	res.render('favorites', { title: 'Favorites' });
});

app.use('/post', postRoutes);

module.NotFound = (req, res) => {
	res.status(404).render('404', { title: 'Not Found' });
}

NotFound = module.NotFound;

// 404, this one works for every url, express reached this one only if it does not get a match before
app.use((req, res) => {
	//res.sendFile('./views/404.html', { root: __dirname });
	//res.status(404).sendFile('./views/404.html', { root: __dirname });
	NotFound(req, res);
})

/*
pool.end(() => {
  console.log('pool has ended')
})
*/