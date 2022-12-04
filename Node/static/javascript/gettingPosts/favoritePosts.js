const favoritePosts = new postGetter({ 
	postContainer: document.querySelector('div.posts'), 
	postParams: { 
		quantity: 12,
		exclude: true,
	},
	getPostsMethod: getFavoritePosts, 
	makePostMethod: makePost,
	onEmpty: () => {
		document.querySelector('div.posts').querySelector("div.empty").style.display = null;
	}
});

getCategoriesSorted(() => {
	favoritePosts.start();
});