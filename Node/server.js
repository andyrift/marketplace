const http = require('http');
const fs = require('fs');
const _ = require('lodash');

// 200 - OK
// 301 - Resource moved
// 404 - not found
// 500 - internal server error

const server = http.createServer((req, res) => {
	
	// lodash
	const num = _.random(0, 20);
	console.log(num);

	// sets header content type
	res.setHeader('Content-Type', 'text/html');

	let path = './views/';

	switch(req.url) {
		case '/':
			path += 'index.html';
			res.statusCode = 200;
			break;
	// redirect
		case '/home':
			res.statusCode = 301;
			res.setHeader('Location', '/');
			res.end();
			break;
		case '/store':
			res.statusCode = 301;
			res.setHeader('Location', '/');
			res.end();
			break;
		default:
			path += '404.html';
			res.statusCode = 404;
			break;
	}


	// send html
	fs.readFile(path, (err, data) => {
		if(err){
			console.log(err);
			res.end();
		} else {
			//res.write(data);
			res.end(data);
		}
	});

});

const port = 3000

server.listen(port, 'localhost', () => {
	console.log(`now listening on port ${port}`);
})