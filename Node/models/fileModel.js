const fs = require('fs');

module.exports.deleteFile = (filename) => {
	fs.unlink(`./uploads/${filename}`, (err) => {
		console.log(err);
	});
}

module.exports.deleteUserPicture = (user) => {
	if(user && user.picture_filename.length > 0) {
		fs.unlink(`./uploads/${user.picture_filename}`, (err) => {
			console.log(err);
		});
	}
}

module.exports.deletePostPicture = (post) => {
	if(post && post.picture_filename.length > 0) {
		fs.unlink(`./uploads/${post.picture_filename}`, (err) => {
			console.log(err);
		});
	}
}