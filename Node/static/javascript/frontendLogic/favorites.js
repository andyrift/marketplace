const favoritePosts = new getter({ 
	container: document.querySelector('div.posts'), 
	params: { 
		quantity: 12,
		exclude: true,
	},
	getMethod: getFavoritePosts, 
	makeMethod: makePost,
	onEmpty: () => {
		document.querySelector('div.posts').querySelector("div.empty").style.display = null;
	}
});

init(() => {
	favoritePosts.start();
});