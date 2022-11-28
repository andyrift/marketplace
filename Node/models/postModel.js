const _ = require('lodash');
const { makeQuery } = require('./cbpromise.js');

module.exports.choosePosts = ( { posts, excludePostIds, quantity, shuffle } ) => {

	if(!quantity || quantity <= 0){
		return [];
	}

	var resultPosts = [];

	if(shuffle) {
		posts=_.shuffle(posts);
	}

	posts.every(post => {
		if (!excludePostIds || !excludePostIds.includes(post.post_id)) {
			resultPosts.push(post);
		}
		if (resultPosts.length == quantity) {
			return false;
		}
		return true;
	});

	return resultPosts;
}

module.exports.getPostById = ({ post_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select * from posts where post_id = $1 and deleted = FALSE', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getPostByIdIncrementViews = ({ post_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'update posts set view_count = view_count + 1 where post_id = $1 and deleted = FALSE returning *', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updatePostFavorites = (callback) => {
	return makeQuery({
		query: {
			text: 
				'update posts set favorite_count = counts.favorite_count from ' +
				'(select posts.post_id, count(*) as favorite_count from posts, favorites ' +
				'where posts.post_id = favorites.post_id group by posts.post_id) as counts ' + 
				'where counts.post_id = posts.post_id', 
			values: [],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updatePostFavoritesById = ({ post_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'update posts set favorite_count = counts.favorite_count from ' +
				'(select posts.post_id, count(*) as favorite_count from posts, favorites ' +
				'where posts.post_id = favorites.post_id group by posts.post_id) as counts ' + 
				'where counts.post_id = posts.post_id and posts.post_id = $1', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.createPost = ({user_id, category_id, title, description, price, address, picture_filename}, callback) => {
	return makeQuery({
		query: {
			text: 
				'insert into posts(user_id, category_id, title, description, price, address, picture_filename, publication_timestamp) ' +
				'values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *', 
			values: [user_id, category_id, title, description, price, address, picture_filename, Date.now()/1000],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deletePostById = ({ post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'update posts set deleted=TRUE where post_id = $1 returning *', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.setPostClosedById = ({post_id, closed}, callback) => {
	return makeQuery({
		query: {
			text: 'update posts set closed=$1 where post_id = $2 returning *', 
			values: [!!closed, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updatePostById_pic = ({post_id, category_id, title, description, price, address, picture_filename}, callback) => {
	return makeQuery({
		query: {
			text: 'update posts set category_id=$1, title=$2, description=$3, price=$4, address=$5, picture_filename = $6 where post_id = $7 returning *', 
			values: [category_id, title, description, price, address, picture_filename, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updatePostById_nopic = ({post_id, category_id, title, description, price, address}, callback) => {
	return makeQuery({
		query: {
			text: 'update posts set category_id=$1, title=$2, description=$3, price=$4, address=$5 where post_id = $6 returning *', 
			values: [category_id, title, description, price, address, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deletePostsByUserId = ({user_id}, callback) => {
	return makeQuery({
		query: {
			text: 'update posts set deleted=TRUE where user_id = $1 returning *', 
			values: [user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getAllPosts = ({closed}, callback) => {
	return makeQuery({
		query: {
			text: 'select * from posts where deleted = FALSE and closed = $1 order by publication_timestamp desc', 
			values: [!!closed],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getPostsByCategory = ({category_id, closed}, callback) => {
	return makeQuery({
		query: {
			text: 'select * from posts where deleted = FALSE and closed = $1 and category_id = $2 order by publication_timestamp desc', 
			values: [!!closed, category_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getPostsByUserId = ({user_id, closed}, callback) => {
	return makeQuery({
		query: {
			text: 'select * from posts where deleted = FALSE and closed = $1 and user_id = $2 order by publication_timestamp desc', 
			values: [!!closed, user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getPostsByUserIdAndCategory = ({user_id, category_id, closed}, callback) => {
	return makeQuery({
		query: {
			text: 'select * from posts where deleted = FALSE and closed = $1 and user_id = $2 and category_id = $3 order by publication_timestamp desc', 
			values: [!!closed, user_id, category_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getCategoryById = (id, callback) => {
	return makeQuery({
		query: {
			text: 'select * from categories where category_id = $1', 
			values: [id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getAllCategories = (callback) => {
	return makeQuery({
		query: {
			text: 'select * from categories', 
			values: [],
		}, 
		single: false,
		callback: callback
	});
}