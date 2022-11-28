const favoritePosts = new postGetter({ 
	postContainer: document.querySelector('div.posts'), 
	postParams: { 
		quantity: 12,
		exclude: true,
	},
	getPostsMethod: getFavoritePosts, 
	makePostMethod: makePost,
});

getCategoriesSorted(() => {
	favoritePosts.start();
});