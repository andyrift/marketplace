const favoritePostsSide = new postGetter({ 
	postContainer: document.querySelector('div.posts#favorites'), 
	postParams: { 
		quantity: 2,
		total: 2,
		exclude: true,
	},
	getPostsMethod: getFavoritePosts, 
	makePostMethod: makePost,
	onEmpty: () => {
		document.querySelector('div.posts#favorites').querySelector("div.empty").style.display = null;
	}
});

favoritePostsSide.start();
