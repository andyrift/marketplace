pool = require.main.pool;

userModel = require("../models/userModel");
postModel = require("../models/postModel");
messagesModel = require("../models/messagesModel");
fetchError = require("./fetchError");

getBlacklist = async (req, res) => {
	let readSize = 2;
	let {cursor, client} = {};
	({cursor, client} = await messagesModel.getBlacklistCursor({
		user_id: req.userInfo.user_id
	}));

	if(!cursor) {
		if(client) {
			await client.release();
		}
		fetchError.sendError(res);
		return;
	}

	blacklist = [];

	if (!req.body.quantity){
		await cursor.close();
		await client.release();
		res.status(200).json({ blacklist });
		return;
	}

	rows = await cursor.read(readSize);
	while (rows.length) {
		if(blacklist.length < req.body.quantity) {

			let result = messagesModel.chooseBlacklist({ 
				blacklist: rows, 
				excludeIds: req.body.excludeIds, 
				quantity: req.body.quantity - blacklist.length,
			});

			for(row of result) {
				blacklist.push(row);
			}

			rows = await cursor.read(readSize);
		} else {
			await cursor.close();
			break;
		}
	}
	await client.release();
	
	res.status(200).json({ blacklist });
}

changeBlacklist = async (req, res) => {
	try {
		row = await messagesModel.checkBlacklistUsername({ user_id: req.userInfo.user_id, blacklisted_username: req.body.username });
		if(row) {
			await messagesModel.removeFromBlacklist({ user_id: req.userInfo.user_id, blacklisted_id: row.blacklisted_user_id });
		} else {
			await messagesModel.addToBlacklistUsername({ user_id: req.userInfo.user_id, blacklisted_username: req.body.username });
		}
		res.status(200).json({ redirect: undefined, blacklisted: !row });
	} catch (err) {
		console.error("Error changing blacklist", err);
		fetchError.sendError(res);
	}
}

module.exports.blacklist_post = (req, res) => {
	if(req.body.get) {
		getBlacklist(req, res);
	} else if (req.body.change) {
		changeBlacklist(req, res);
	} else {
		fetchError.sendError(res);
	}
}

getMessages = async (req, res) => {
	let readSize = 5;
	let {cursor, client} = {};
	({cursor, client} = await messagesModel.getDialoguesCursor({
		user_id: req.userInfo.user_id
	}));

	if(!cursor) {
		if(client) {
			await client.release();
		}
		fetchError.sendError(res);
		return;
	}

	dialogues = [];

	if (!req.body.quantity){
		await cursor.close();
		await client.release();
		res.status(200).json({ dialogues });
		return;
	}

	rows = await cursor.read(readSize);
	while (rows.length) {
		if(dialogues.length < req.body.quantity) {

			let result = messagesModel.chooseDialogues({ 
				dialogues: rows, 
				excludeIds: req.body.excludeIds, 
				quantity: req.body.quantity - dialogues.length,
			});

			for(row of result) {
				dialogues.push(row);
			}

			rows = await cursor.read(readSize);
		} else {
			await cursor.close();
			break;
		}
	}
	await client.release();
	
	res.status(200).json({ dialogues });
}

checkMessages = async (req, res) => {
	if(isNaN(parseInt(req.body.post_id))) {
		fetchError.sendError(res);
		return;
	}

	let dialogue = await messagesModel.checkDialogue({
		user_id: req.userInfo.user_id,
		post_id: parseInt(req.body.post_id)
	})

	if (dialogue) {
		res.status(200).json({ redirect: `/chat/${dialogue.dialogue_id}` });
		return;
	}

	res.status(200).json({ redirect: null });
}

module.exports.messages_post = (req, res) => {
	if(req.body.get) {
		getMessages(req, res);
	} else if(req.body.check) {
		checkMessages(req, res);
	} else {
		fetchError.sendError(res);
	}
}

sendMessage = async (req, res) => {

	if(isNaN(parseInt(req.params.id))) {
		if(isNaN(parseInt(req.body.post_id))) {
			fetchError.sendError(res);
			return;
		}
		let dialogue = await messagesModel.checkDialogue({
			user_id: req.userInfo.user_id,
			post_id: parseInt(req.body.post_id)
		});


		if(!dialogue) {
			post = await postModel.getPostById({ post_id: parseInt(req.body.post_id) })
			if (post.closed) {
				res.status(200).json({ closed: true });
				return;
			}
			if (await messagesModel.checkBlacklist({
				user_id: post.user_id,
				blacklisted_id: req.userInfo.user_id
			})) {
				res.status(200).json({ blacklisted: true });
				return;
			}
			dialogue = await messagesModel.createDialogue({
				user_id: req.userInfo.user_id,
				post_id: parseInt(req.body.post_id)
			})
		}

		let user = await messagesModel.getOwner({
			dialogue_id: dialogue.dialogue_id
		})

		user_id = dialogue.customer_user_id;

		if(req.userInfo.user_id === dialogue.customer_user_id) {
			user_id = user.user_id;
		}

		if (await messagesModel.checkBlacklist({
			user_id,
			blacklisted_id: req.userInfo.user_id
		})) {
			res.status(200).json({});
			return;
		}

		await messagesModel.addMessage({
			user_id: req.userInfo.user_id,
			dialogue_id: dialogue.dialogue_id,
			message_body: req.body.message_body
		});

		res.status(200).json({ redirect: `/chat/${dialogue.dialogue_id}` });

		return;
	}

	let dialogue = await messagesModel.checkDialogueId({
		user_id: req.userInfo.user_id,
		dialogue_id: parseInt(req.params.id)
	})

	if (!dialogue || !req.body.message_body) {
		fetchError.sendError(res);
		return;
	}

	let user = await messagesModel.getOwner({
		dialogue_id: dialogue.dialogue_id
	})

	user_id = dialogue.customer_user_id;

	if(req.userInfo.user_id === dialogue.customer_user_id) {
		user_id = user.user_id;
	}

	if (await messagesModel.checkBlacklist({
		user_id,
		blacklisted_id: req.userInfo.user_id
	})) {
		res.status(200).json({});
		return;
	}

	await messagesModel.addMessage({
		user_id: req.userInfo.user_id,
		dialogue_id: parseInt(req.params.id),
		message_body: req.body.message_body
	});

	res.status(200).json({});
}

getChatMessages = async (req, res) => {

	if(isNaN(parseInt(req.params.id))) {
		fetchError.sendError(res);
		return;
	}

	let dialogue = await messagesModel.checkDialogueId({
		user_id: req.userInfo.user_id,
		dialogue_id: parseInt(req.params.id)
	})

	if (!dialogue) {
		fetchError.sendError(res);
		return;
	}


	let readSize = 20;
	let {cursor, client} = {};

	if(req.body.top) {
		({cursor, client} = await messagesModel.getMessagesBackwardsCursor({
			dialogue_id: dialogue.dialogue_id
		}));
	} else {
		({cursor, client} = await messagesModel.getMessagesCursor({
			dialogue_id: dialogue.dialogue_id
		}));
	}

	if(!cursor) {
		if(client) {
			await client.release();
		}
		fetchError.sendError(res);
		return;
	}

	messages = [];

	if (!req.body.quantity){
		await cursor.close();
		await client.release();
		res.status(200).json({ messages });
		return;
	}

	let picking = false;

	if (!req.body.lastUp) {
		picking = true;
	}

	rows = await cursor.read(readSize);
	while (rows.length) {
		if(messages.length < req.body.quantity) {

			for(row of rows) {
				if(picking) {
					messages.push(row);
					if(messages.length === req.body.quantity) {
						break;
					}
				} else {
					if(req.body.top) {
						if (row.message_id === req.body.lastUp) {
							picking = true;
						}
					} else if (req.body.lastDown) {
						if (row.message_id === req.body.lastDown) {
							picking = true;
						}
					}
				}
			}

			rows = await cursor.read(readSize);
		} else {
			await cursor.close();
			break;
		}
	}
	await client.release();
	
	res.status(200).json({ messages });
}

module.exports.chat_post = (req, res) => {
	if(req.body.send && req.userInfo) {
		sendMessage(req, res);
	} else if(req.body.get) {
		getChatMessages(req, res);
	} else {
		fetchError.sendError(res);
	}
}

module.exports.chat_get = async (req, res) => {

	if(isNaN(parseInt(req.params.id))) {
		res.status(404).render('404', { title: 'Not Found' });
		return;
	}

	let dialogue = await messagesModel.checkDialogueId({
		user_id: req.userInfo.user_id,
		dialogue_id: parseInt(req.params.id)
	})

	if (!dialogue) {
		res.status(404).render('404', { title: 'Not Found' });
		return;
	}

	let user = await messagesModel.getOwner({
		dialogue_id: dialogue.dialogue_id
	})

	if(user.user_id === req.userInfo.user_id) {
		user = await userModel.getUserByIdAny({ user_id: dialogue.customer_user_id });
	} else {
		user = await userModel.getUserByIdAny({ user_id: user.user_id });
	}

	let post = await postModel.getPostByIdAny({ post_id: dialogue.post_id });

	let blacklisted = false;
	let blacklisting = false;

	if (user) {
		blacklisted = await messagesModel.checkBlacklist({
			user_id: user.user_id,
			blacklisted_id: req.userInfo.user_id,
		});

		blacklisting = await messagesModel.checkBlacklist({
			user_id: req.userInfo.user_id,
			blacklisted_id: user.user_id,
		})
	}

	

	res.render('chat', { title: 'Chat', participant: user, post, blacklisted, blacklisting });
}