const fPostContainer = document.querySelector('div.posts#favorites');

drawFPosts = (posts) => {
	posts.forEach(post => {
		fPostContainer.appendChild(makePost(post));
	});
}

getFPosts = () => {
	getFavoritePosts({ quantity: 2, excludePostIds: [] }, (posts) => {
		drawFPosts(posts);
	});
}

getFPosts();