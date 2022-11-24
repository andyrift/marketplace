const _ = require('lodash');
const cbpromise = require('./cbpromise.js');

module.exports.choosePosts = (posts, excludePostIds, quantity) => {

	if(!quantity){
		return [];
	}

	var resultPosts = [];

	posts=_.shuffle(posts);

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
	return cbpromise.makeQuery({
		query: {
			text: 
				'select posts.user_id, posts.post_id, posts.category_id, posts.picture_filename, ' +
				'posts.price, posts.title, posts.description, posts.address, posts.publication_timestamp, ' +
				'posts.favorite_count, posts.view_count, posts.closed, posts.deleted ' + 
				'from posts where post_id = $1 and deleted = FALSE', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.createPost = ({user_id, category_id, title, description, price, address, picture_filename}, callback) => {
	return cbpromise.makeQuery({
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
	return cbpromise.makeQuery({
		query: {
			text: 'update posts set deleted=TRUE where post_id = $1 returning *', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.setPostClosedById = ({post_id, closed}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: closed ? 
				'update posts set closed=TRUE where post_id = $1 returning *' : 
				'update posts set closed=FALSE where post_id = $1 returning *', 
			values: [post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updatePostById_pic = ({post_id, category_id, title, description, price, address, picture_filename}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'update posts set category_id=$1, title=$2, description=$3, price=$4, address=$5, picture_filename = $6 where post_id = $7 returning *', 
			values: [category_id, title, description, price, address, picture_filename, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updatePostById_nopic = ({post_id, category_id, title, description, price, address}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'update posts set category_id=$1, title=$2, description=$3, price=$4, address=$5 where post_id = $6 returning *', 
			values: [category_id, title, description, price, address, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deletePostsByUserId = ({user_id}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'update posts set deleted=TRUE where user_id = $1 returning *', 
			values: [user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getAllPosts = ({closed}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: closed ? 
				'select * from posts where deleted = FALSE and closed = TRUE' : 
				'select * from posts where deleted = FALSE and closed = FALSE', 
			values: [],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getPostsByCategory = ({category_id, closed}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: closed ?
				'select * from posts where deleted = FALSE and closed = TRUE and category_id = $1' : 
				'select * from posts where deleted = FALSE and closed = FALSE and category_id = $1', 
			values: [category_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getPostsByUserId = ({user_id, closed}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: closed ? 
				'select * from posts where deleted = FALSE and closed = TRUE and user_id = $1' : 
				'select * from posts where deleted = FALSE and closed = FALSE and user_id = $1', 
			values: [user_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getPostsByUserIdAndCategory = ({user_id, category_id, closed}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: closed ?
				'select * from posts where deleted = FALSE and closed = TRUE and user_id = $1 and category_id = $2' : 
				'select * from posts where deleted = FALSE and closed = FALSE and user_id = $1 and category_id = $2', 
			values: [user_id, category_id],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.getCategoryById = (id, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'select * from categories where category_id = $1', 
			values: [id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getAllCategories = (callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'select * from categories', 
			values: [],
		}, 
		single: false,
		callback: callback
	});
}