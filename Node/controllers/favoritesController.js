pool = require.main.pool;

favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");

module.exports.favoritesPage_get = (req, res) => {
	res.render('favorites', { title: 'Favorites', user_id: 14 });
}

changeFavorite = async (req, res) => {
	try {
		favorite = !!(await favoritesModel.getFavorite({ user_id: parseInt(14), post_id: parseInt(req.body.post_id) }));
		if (favorite) {
			await favoritesModel.deleteFavorite({ user_id: parseInt(14), post_id: parseInt(req.body.post_id) });
		} else {
			await favoritesModel.addFavorite({ user_id: parseInt(14), post_id: parseInt(req.body.post_id) });
		}
		res.status(200).json({ redirect: undefined, favorite: !favorite });
	} catch (err) {
		console.error("Error changing favorite", err);
		fetchError.sendError(res);
	}
}

getFavorites = (req, res) => {
	favoritesModel.getFavoritesByUserId(14, (err, posts) => {
		if (err) {
			console.error('Error getting favorites', err);
			fetchError.sendError(res);
		} else {
			res.status(200).json({ posts: postModel.choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
		}
	});
}

module.exports.favorites_post = (req, res) => {
	if (req.body.change) {
		changeFavorite(req, res);
	} else if (req.body.get) {
		getFavorites(req, res)
	}
}