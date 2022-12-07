const fs = require('fs');

module.exports.deleteFile = (filename) => {
	try {
		fs.unlinkSync(`./uploads/${filename}`);
	} catch(err) {
		console.log(err);
		return false;
	}
	return true;
}

module.exports.deleteUserPicture = (user) => {
	try {
		if(user && user.picture_filename.length) {
			fs.unlinkSync(`./uploads/${user.picture_filename}`);
		}
	} catch(err) {
		console.log(err);
		return false;
	}
	return true;
}

module.exports.deletePostPicture = (post) => {
	try {
		if(post && post.picture_filename.length) {
			fs.unlinkSync(`./uploads/${post.picture_filename}`);
		}
	} catch(err) {
		console.log(err);
		return false;
	}
	return true;
}