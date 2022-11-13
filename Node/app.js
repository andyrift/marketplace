const express = require('express');

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');

//app.set('views', 'views');

// listen

const port = 3000
app.listen(port);
console.log(`now listening on port ${port}`);

app.get('/', (req, res) => {
	res.sendFile('./views/index.html', { root: __dirname });
});
//redirect
app.get('/home', (req, res) => {
	res.redirect('/');
});

// 404, this one works for every url, only if express reached this one not getting a match before
// use is used for middleware
app.use((req, res) => {
	//res.sendFile('./views/404.html', { root: __dirname });
	res.status(404).sendFile('./views/404.html', { root: __dirname });
})