const favoritePostsSide = new getter({ 
	container: document.querySelector('div.posts#favorites'), 
	params: { 
		quantity: 2,
		total: 2,
		exclude: true,
	},
	getMethod: getFavoritePosts, 
	makeMethod: makePost,
	onEmpty: () => {
		document.querySelector('div.posts#favorites').querySelector("div.empty").style.display = null;
	}
});