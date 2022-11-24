const fs = require('fs');

module.exports.deleteFile = (filename) => {
	fs.unlink(`./uploads/${filename}`, (err) => {
	  if (err) {
	    console.error(err);
	  }
	});
}

module.exports.deleteUserPicture = (user) => {
	if(user && user.picture_filename.length > 0) {
		fs.unlink(`./uploads/${user.picture_filename}`, (err) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		});
	}
}

module.exports.deletePostPicture = (post) => {
	if(post && post.picture_filename.length > 0) {
		fs.unlink(`./uploads/${post.picture_filename}`, (err) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		});
	}
}