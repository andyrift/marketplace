const cbpromise = require('./cbpromise.js');

module.exports.getFavoritesByUserId = (id, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 
				'select posts.user_id, posts.post_id, posts.category_id, posts.picture_filename, ' +
				'posts.price, posts.title, posts.description, posts.address, posts.publication_timestamp, ' +
				'posts.favorite_count, posts.view_count, posts.closed, posts.deleted ' + 
				'from posts, favorites where posts.deleted = FALSE and favorites.post_id = posts.post_id and favorites.user_id = $1', 
			values: [id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.addFavorite = ({ user_id, post_id }, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'insert into favorites(user_id, post_id) values($1, $2) returning *', 
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getFavorite = ({ user_id, post_id }, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'select * from favorites where user_id = $1 and post_id = $2', 
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deleteFavorite = ({ user_id, post_id }, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'delete from favorites where user_id = $1 and post_id = $2 returning *', 
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deleteFavoritesByUserId = (user_id, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'delete from favorites where user_id = $1 returning *', 
			values: [user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.deleteFavoritesByPostId = (post_id, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'delete from favorites where post_id = $1 returning *', 
			values: [post_id],
		}, 
		single: false,
		callback: callback
	});
}