username = document.querySelector('div.profile').dataset.username;

const openPosts = new postGetter({ 
	postContainer: document.querySelector('div#open'), 
	postParams: { 
		quantity: 6,
		exclude: true,
		username: username, 
		closed: false,
	},
	getPostsMethod: getPosts, 
	makePostMethod: makePost,
});

const closedPosts = new postGetter({ 
	postContainer: document.querySelector('div#closed'), 
	postParams: { 
		quantity: 6,
		exclude: true,
		username: username, 
		closed: true,
	},
	getPostsMethod: getPosts, 
	makePostMethod: makePost,
});

showOpen = () => {
	openPosts.start();
	closedPosts.stop();
	openPosts.getPostContainer.style = null;
	closedPosts.getPostContainer.style = "display: none;";
}

showClosed = () => {
	openPosts.stop();
	closedPosts.start();
	openPosts.getPostContainer.style = "display: none;";
	closedPosts.getPostContainer.style = null;
}

showOpen();


