if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const multer  = require('multer');
const _ = require('lodash');
const md5 = require('md5');
const cookieParser = require('cookie-parser');
const app = express();
const auth = require('./middleware/authMiddleware.js');

// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'views');

multerStorage = multer.diskStorage({ 
	destination: (req, file, cb) => {
		cb(null, `uploads/`);
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		cb(null, `${md5((Math.random().toString(36)+'00000000000000000').slice(2, 18))}-${Date.now()}.${ext}`);
	}
});

require.main.upload = multer({ storage: multerStorage });

// pool
// uses environment variables for connection information
const { Pool } = require('pg');
require.main.pool = new Pool({
	max: 10
});
// the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
require.main.pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
var types = require('pg').types
types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => {return new Date(val)});


//components
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const favoritesRoutes = require("./routes/favoritesRoutes.js");
const messagesRoutes = require("./routes/messagesRoutes.js");
const postController = require("./controllers/postController.js");


// dictionary for text generator 
/*
fs.readFile('./static/words_dictionary.json', (err, data) => {
    if (err) throw err;
    require.main.words = Object.keys(JSON.parse(data));
});
*/

// static files

app.use(express.static('static'));
app.use(express.static('uploads'));

// middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(auth.checkAuth);

// routes

app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});

app.get('/categories', postController.allCategories_get);

app.get('/help', (req, res) => {
	res.render('help', { title: 'Help' });
});

app.use('/favorites', favoritesRoutes);
app.use('/post', postRoutes);
app.use(messagesRoutes);
app.use(userRoutes);
app.use(authRoutes);


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

// listen
const port = 80
app.listen(port);
console.log(`now listening on port ${port}`);
