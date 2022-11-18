if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const _ = require('lodash');
const app = express();


// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'views');


// pool
// uses environment variables for connection information
const { Pool } = require('pg');
require.main.pool = new Pool();
// the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
require.main.pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});


//components
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const postController = require("./controllers/postController.js");


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

fs.readFile('./static/words_dictionary.json', (err, data) => {
    if (err) throw err;
    require.main.words = Object.keys(JSON.parse(data));
    
});


// middleware & static files

app.use(express.static('static'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', postController.allPosts_get);

app.get('/categories', postController.allCategories_get);

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
	res.render('messages', { title: 'Messages', user: {} });
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

app.use(userRoutes);


NotFound = module.NotFound;

// 404, this one works for every url, express reached this one only if it does not get a match before
app.use((req, res) => {
	//res.sendFile('./views/404.html', { root: __dirname });
	//res.status(404).sendFile('./views/404.html', { root: __dirname });
	res.status(404).render('404', { title: 'Not Found' });
})

/*
pool.end(() => {
  console.log('pool has ended')
})
*/