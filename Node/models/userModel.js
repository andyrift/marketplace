const md5 = require('md5');
const cbpromise = require('./cbpromise.js');

module.exports.getUserById = (user_id, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'select * from users where user_id = $1 and deleted = FALSE', 
			values: [user_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getUserByUsername = (username, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'select * from users where username = $1 and deleted = FALSE', 
			values: [username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getAllUsers = (callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'select * from users where deleted = FALSE', 
			values: [],
		}, 
		single: false,
		callback: callback
	});
}

module.exports.createUser = ({username, displayname, password, email, address, picture_filename}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 
				'insert into users(role_id, username, displayname, password_hash, email, picture_filename, address, joined_timestamp) ' + 
				'values($1, $2, $3, $4, $5, $6, $7, to_timestamp($8)) returning *', 
			values: [1, username, displayname, md5(password), email, picture_filename, address, Date.now()/1000],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updateUserByUsername_pic = ({username, displayname, email, address, picture_filename}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'update users set displayname = $1, email = $2, picture_filename = $3, address = $4 where username = $5 returning *', 
			values: [displayname, email, picture_filename, address, username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.updateUserByUsername_nopic = ({username, displayname, email, address}, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'update users set displayname = $1, email = $2, address = $3 where username = $4 returning *', 
			values: [displayname, email, address, username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.deleteUserByUsername = (username, callback) => {
	return cbpromise.makeQuery({
		query: {
			text: 'update users set deleted=TRUE where username = $1 returning *', 
			values: [username],
		}, 
		single: true,
		callback: callback
	});
}