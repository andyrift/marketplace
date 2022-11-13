const express = require('express');
const morgan = require('morgan');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'views');

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

app.use(morgan('dev'));

// routing

app.get('/', (req, res) => {
	//res.sendFile('./views/index.html', { root: __dirname });
	res.render('index', { title: 'Home' });
});
app.get('/profile', (req, res) => {
	res.render('profile', { title: 'Profile' });
});
app.get('/help', (req, res) => {
	res.render('help', { title: 'Help' });
});
app.get('/messages', (req, res) => {
	res.render('messages', { title: 'Messages' });
});
app.get('/favorites', (req, res) => {
	res.render('favorites', { title: 'Favorites' });
});


//redirect example
/*
app.get('/home', (req, res) => {
	res.redirect('/');
});
*/

// 404, this one works for every url, express reached this one only if it does not get a match before
app.use((req, res) => {
	//res.sendFile('./views/404.html', { root: __dirname });
	//res.status(404).sendFile('./views/404.html', { root: __dirname });
	res.status(404).render('404', { title: 'Not Found' });
})