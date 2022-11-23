pool = require.main.pool;

favoritesModel = require("../models/favoritesModel");
fetchError = require("./fetchError");

favoritesPage_get = (req, res) => {
	res.render('favorites', { title: 'Favorites', user_id: 14 });
}

addFavorite_post = (req, res) => {
	favoritesModel.getFavorite({
		user_id: parseInt(14),
		post_id: parseInt(req.body.post_id),
	})
	.then(qres => {
		if (qres) {
			console.log(qres);
			res.status(302).json({ redirect: '/favorites' });
		} else{
			favoritesModel.addFavorite({
				user_id: parseInt(14),
				post_id: parseInt(req.body.post_id),
			}, (err) => {
				if (err) {
					console.error('Error adding favorite', err);
					fetchError.sendError(res);
				} else {
					res.status(302).json({ redirect: '/favorites' });
				}
			});
		}
	})
	.catch (err => {
		console.error('Error adding favorite', err);
		fetchError.sendError(res);
	});
}

deleteFavorite_delete = (req, res) => {
  favoritesModel.deleteFavorite({
		user_id: parseInt(14),
		post_id: parseInt(req.body.post_id),
	}, (err) => {
		if (err) {
			console.error('Error deleting favorite', err);
			fetchError.sendError(res);
		} else {
			res.status(302).json({ redirect: '/favorites' });
		}
	});
}

getFavorites_post = (req, res) => {
	favoritesModel.getFavoritesByUserId(14, (err, posts) => {
		if (err) {
			console.error('Error getting favorites', err);
			fetchError.sendError(res);
		} else {
			res.status(200).json({ posts: postModel.choosePosts(posts, req.body.excludePostIds, req.body.quantity) });
		}
	});
}

module.exports = {
	favoritesPage_get,
	addFavorite_post,
	deleteFavorite_delete,
	getFavorites_post,
}