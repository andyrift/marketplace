const { makeQuery, makeCursor } = require('./queries.js');

module.exports.chooseBlacklist = ( { blacklist, excludeIds, quantity } ) => {

	if(!quantity || quantity <= 0){
		return [];
	}

	var result = [];

	blacklist.every(row => {
		if (!excludeIds || !excludeIds.includes(row.blacklisted_user_id)) {
			result.push(row);
		}
		if (result.length == quantity) {
			return false;
		}
		return true;
	});

	return result;
}

module.exports.chooseDialogues = ( { dialogues, excludeIds, quantity } ) => {

	if(!quantity || quantity <= 0){
		return [];
	}

	var result = [];

	dialogues.every(row => {
		if (!excludeIds || !excludeIds.includes(row.dialogue_id)) {
			result.push(row);
		}
		if (result.length == quantity) {
			return false;
		}
		return true;
	});

	return result;
}

module.exports.getBlacklistCursor = async ({ user_id }) => {
	return await makeCursor({
		query: {
			text: 'select blacklist.*, users.displayname, users.picture_filename as user_picture_filename, users.username from blacklist, users where blacklisting_user_id = $1 and blacklisted_user_id = users.user_id order by users.joined_timestamp desc', 
			values: [user_id],
		}
	});
}

module.exports.checkBlacklist = ({ user_id, blacklisted_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select blacklist.* from blacklist,users where blacklisting_user_id = $1 and blacklisted_user_id = $2', 
			values: [user_id, blacklisted_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.checkBlacklistUsername = ({ user_id, blacklisted_username }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select blacklist.* from blacklist,users where blacklisting_user_id = $1 and blacklisted_user_id = users.user_id and users.username = $2', 
			values: [user_id, blacklisted_username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.removeFromBlacklist = ({ user_id, blacklisted_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'delete from blacklist where blacklisting_user_id = $1 and blacklisted_user_id = $2', 
			values: [user_id, blacklisted_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.addToBlacklistUsername = ({ user_id, blacklisted_username }, callback) => {
	return makeQuery({
		query: {
			text: 
				'insert into blacklist (blacklisting_user_id, blacklisted_user_id) select $1, users.user_id from users where username = $2', 
			values: [user_id, blacklisted_username],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.clearBlacklist = ({ user_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'delete from blacklist where blacklisting_user_id = $1 or blacklisted_user_id = $2', 
			values: [user_id, user_id],
		}, 
		single: true,
		callback: callback
	});
}

/* 
				'select * from (' +
				'select dialogues.*, users.username, users.displayname, users.picture_filename as user_picture_filename, posts.title, users.joined_timestamp ' +
				'from dialogues,users,posts ' +
				'where dialogues.customer_user_id = $1 ' +
				'and dialogues.post_id = posts.post_id ' +
				'and posts.user_id = users.user_id ' +
				'union ' +
				'select dialogues.*, users.username, users.displayname, users.picture_filename as user_picture_filename, posts.title, users.joined_timestamp ' +
				'from dialogues,users,posts ' +
				'where dialogues.customer_user_id = users.user_id ' +
				'and dialogues.post_id = posts.post_id ' +
				'and posts.user_id = $1 ' +
				') as t1 ' +
				'order by joined_timestamp desc '
*/

module.exports.getDialoguesCursor = ({ user_id }) => {
	return makeCursor({
		query: {
			text: 
				'with t1 as ( ' +
				'	select dialogues.*, posts.user_id as user_id, max(messages.send_timestamp) as maxts ' +
				'	from dialogues,posts,messages ' +
				'	where dialogues.customer_user_id = $1 ' +
				'	and messages.dialogue_id = dialogues.dialogue_id ' +
				'	and posts.post_id = dialogues.post_id ' +
				'	group by dialogues.dialogue_id, posts.user_id ' +
				'	union ' +
				'	select dialogues.*, dialogues.customer_user_id as user_id, max(messages.send_timestamp) as maxts ' +
				'	from dialogues,posts,messages ' +
				'	where dialogues.post_id = posts.post_id ' +
				'	and posts.user_id = $1 ' +
				'	and messages.dialogue_id = dialogues.dialogue_id ' +
				'	group by dialogues.dialogue_id, posts.user_id ' +
				') ' +
				'select t1.*, messages.*, users.username, users.displayname, users.picture_filename as user_picture_filename, ' +
				'	posts.title from t1, messages, users, posts ' +
				'where messages.send_timestamp = maxts ' +
				'and t1.user_id = users.user_id ' +
				'and t1.post_id = posts.post_id ' +
				'order by maxts desc', 
			values: [user_id],
		}
	});
}

module.exports.getMessagesCursor = ({ dialogue_id }) => {
	return makeCursor({
		query: {
			text: 
				'select messages.*, users.username, users.displayname, users.picture_filename as user_picture_filename from messages, users where dialogue_id = $1 and (messages.sender_id = users.user_id) order by send_timestamp', 
			values: [dialogue_id],
		}
	});
}

module.exports.getMessagesBackwardsCursor = ({ dialogue_id }) => {
	return makeCursor({
		query: {
			text: 
				'select messages.*, users.username, users.displayname, users.picture_filename as user_picture_filename from messages, users where dialogue_id = $1 and (messages.sender_id = users.user_id) order by send_timestamp desc', 
			values: [dialogue_id],
		}
	});
}

module.exports.checkDialogueId = ({ user_id, dialogue_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select * from (' +
				'select dialogues.* ' +
				'from dialogues ' +
				'where dialogues.customer_user_id = $1 ' +
				'union ' +
				'select dialogues.* ' +
				'from dialogues, posts ' +
				'where dialogues.post_id = posts.post_id ' +
				'and posts.user_id = $1 ' +
				') as t1 ' +
				'where dialogue_id = $2', 
			values: [user_id, dialogue_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.checkDialogue = ({ user_id, post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'select * from dialogues where customer_user_id = $1 and post_id = $2',
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.createDialogue = ({ user_id, post_id }, callback) => {
	return makeQuery({
		query: {
			text: 'insert into dialogues (customer_user_id, post_id) values ($1, $2) returning *',
			values: [user_id, post_id],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.addMessage = ({ user_id, dialogue_id, message_body }, callback) => {
	return makeQuery({
		query: {
			text: 
				'insert into messages (sender_id, dialogue_id, message_body, send_timestamp) values ($1, $2, $3, to_timestamp($4))', 
			values: [user_id, dialogue_id, message_body, Date.now()/1000],
		}, 
		single: true,
		callback: callback
	});
}

module.exports.getOwner = ({ dialogue_id }, callback) => {
	return makeQuery({
		query: {
			text: 
				'select posts.user_id from dialogues, posts where dialogue_id = $1 and dialogues.post_id = posts.post_id', 
			values: [dialogue_id],
		}, 
		single: true,
		callback: callback
	});
}