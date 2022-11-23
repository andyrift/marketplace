const fs = require('fs');

deleteFile = (filename) => {
	fs.unlink(`./uploads/${filename}`, (err) => {
	  if (err) {
	    console.error(err);
	  }
	});
}

deleteUserPicture = (user) => {
	if(user && user.picture_filename.length > 0) {
		fs.unlink(`./uploads/${user.picture_filename}`, (err) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		});
	}
}

deletePostPicture = (post) => {
	if(post && post.picture_filename.length > 0) {
		fs.unlink(`./uploads/${post.picture_filename}`, (err) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		});
	}
}

module.exports = {
	deleteFile,
	deleteUserPicture,
	deletePostPicture
}