pool = require.main.pool;

postModel = require("../models/postModel");
favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");

module.exports.favoritesPage_get = (req, res) => {
	res.render('favorites', { title: 'Favorites', user_id: 14 });
}

changeFavorite = async (req, res) => {
	try {
		favorite = !!(await favoritesModel.getFavorite({ user_id: req.userInfo.user_id, post_id: parseInt(req.body.post_id) }));
		if (favorite) {
			await favoritesModel.deleteFavorite({ user_id: req.userInfo.user_id, post_id: parseInt(req.body.post_id) });
		} else {
			await favoritesModel.addFavorite({ user_id: req.userInfo.user_id, post_id: parseInt(req.body.post_id) });
		}
		res.status(200).json({ redirect: undefined, favorite: !favorite });
	} catch (err) {
		console.error("Error changing favorite", err);
		fetchError.sendError(res);
	}
}

getFavorites = async (req, res) => {
	let readSize = 2;
	let {cursor, client} = {};

	if(req.body.shuffle) {
		({cursor, client} = await favoritesModel.getFavoritesByUserIdCursorShuffle(req.userInfo.user_id));
	} else {
		({cursor, client} = await favoritesModel.getFavoritesByUserIdCursor(req.userInfo.user_id));
	}

	if(!cursor) {
		if(client) {
			await client.release();
		}
		fetchError.sendError(res);
		return;
	}

	posts = [];

	if (!req.body.quantity){
		await cursor.close();
		await client.release();
		res.status(200).json({ posts });
		return;
	}

	rows = await cursor.read(readSize);
	while (rows.length) {
		if(posts.length < req.body.quantity) {
			postModel.choosePosts({ 
				posts: rows, 
				excludePostIds: req.body.excludePostIds, 
				quantity: req.body.quantity - posts.length,
			}).forEach(post => {
				posts.push(post);
			});
			rows = await cursor.read(readSize);
		} else {
			await cursor.close();
			break;
		}
	}
	await client.release();
	res.status(200).json({ posts });
}

module.exports.favorites_post = async (req, res) => {
	if (req.body.change) {
		changeFavorite(req, res);
	} else if (req.body.get) {
		getFavorites(req, res)
	}
}