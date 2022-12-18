const { makeQuery, makeCursor } = require('./queries.js');

module.exports.getFavoritesByUserId = ({ user_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select posts.* from posts, favorites ' + 
				'where posts.deleted = FALSE and favorites.post_id = posts.post_id and favorites.user_id = $1 ' +
				'order by publication_timestamp desc', 
			values: [user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getFavoritesByUserIdCursor = ({ user_id }) => {
	return makeCursor({
		query: {
			text: 
				'select posts.* from posts, favorites ' + 
				'where posts.deleted = FALSE and favorites.post_id = posts.post_id and favorites.user_id = $1 ' +
				'order by publication_timestamp desc', 
			values: [user_id],
		}
	});
}

module.exports.getFavoritesByUserIdCursorShuffle = ({ user_id }) => {
	return makeCursor({
		query: {
			text: 
				'select posts.* from posts, favorites ' + 
				'where posts.deleted = FALSE and favorites.post_id = posts.post_id and favorites.user_id = $1 ' +
				'order by random()', 
			values: [user_id],
		}
	});
}

module.exports.addFavorite = ({ user_id, post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'insert into favorites(user_id, post_id) values($1, $2) returning *', 
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getFavorite = ({ user_id, post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'select * from favorites where user_id = $1 and post_id = $2', 
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deleteFavorite = ({ user_id, post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'delete from favorites where user_id = $1 and post_id = $2 returning *', 
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deleteFavoritesByUserId = ({ user_id }, callback) => {
	return makeQuery({
		query: {
			text: 'delete from favorites where user_id = $1 returning *', 
			values: [user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.deleteFavoritesByPostId = ({ post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'delete from favorites where post_id = $1 returning *', 
			values: [post_id],
		}, 
		single: false,
		callback: callback
	});
}