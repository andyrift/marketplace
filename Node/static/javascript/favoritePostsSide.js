const fPostContainer = document.querySelector('div.posts#favorites');

drawFPosts = (posts) => {
	posts.forEach(post => {
		fPostContainer.appendChild(makePost(post));
	});
}

getRandomFPosts = () => {
	getPosts({ quantity: 2 }, (posts) => {
		drawFPosts(posts);
	});
}

getRandomFPosts();