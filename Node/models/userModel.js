const bcrypt = require('bcrypt');

const { makeQuery } = require('./cbpromise.js');

module.exports.getUserById = (user_id, callback) => {
	return makeQuery({
		query: {
			text: 'select * from users where user_id = $1 and deleted = FALSE', 
			values: [user_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getUserByUsername = (username, callback) => {
	return makeQuery({
		query: {
			text: 'select * from users where username = $1 and deleted = FALSE', 
			values: [username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getAllUsers = (callback) => {
	return makeQuery({
		query: {
			text: 'select * from users where deleted = FALSE', 
			values: [],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.hashPassword = async (password) => {
	return new Promise(async (resolve, reject) => {
		try {
			const salt = await bcrypt.genSalt();
			password = await bcrypt.hash(password, salt);
			resolve(password);
		} catch (err) {
			reject(err);
		}
	});
}

module.exports.createUser = ({username, displayname, password, email, address, picture_filename}, callback) => {
	return makeQuery({
		query: {
			text: 
				'insert into users(role_id, username, displayname, password, email, picture_filename, address, joined_timestamp) ' + 
				'values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *', 
			values: [1, username, displayname, password, email, picture_filename, address, Date.now()/1000],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updateUserByUsername_pic = ({username, displayname, email, address, picture_filename}, callback) => {
	return makeQuery({
		query: {
			text: 'update users set displayname = $1, email = $2, picture_filename = $3, address = $4 where username = $5 returning *', 
			values: [displayname, email, picture_filename, address, username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updateUserByUsername_nopic = ({username, displayname, email, address}, callback) => {
	return makeQuery({
		query: {
			text: 'update users set displayname = $1, email = $2, address = $3 where username = $4 returning *', 
			values: [displayname, email, address, username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deleteUserByUsername = (username, callback) => {
	return makeQuery({
		query: {
			text: 'update users set deleted=TRUE where username = $1 returning *', 
			values: [username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.setRating = ({ sender_id, reciever_id, rating }, callback) => {
	return makeQuery({
		query: {
			text: 
				'insert into ratings(sender_id, reciever_id, rating) values($1, $2, $3) ' + 
				'on conflict (sender_id, reciever_id) do update set rating=$4 returning *', 
			values: [sender_id, reciever_id, rating, rating],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getRating = ({ sender_id, reciever_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select * from ratings where sender_id = $1 and reciever_id = $2', 
			values: [sender_id, reciever_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updateUserRating = ({ user_id, rating }, callback) => {
	return makeQuery({
		query: {
			text: 
				'update users set rating = $1 where user_id = $2 returning *', 
			values: [rating, user_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.calculateUserRating = ({ reciever_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select avg(rating) from ratings where reciever_id = $1', 
			values: [reciever_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.clearRating = ({ reciever_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'delete from ratings where reciever_id = $1', 
			values: [reciever_id],
		}, 
		single: true,
		callback: callback
	});
}