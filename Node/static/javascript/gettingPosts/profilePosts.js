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
	onEmpty: () => {
		document.querySelector('div#open').querySelector("div.empty").style.display = null;
	}
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
	onEmpty: () => {
		document.querySelector('div#closed').querySelector("div.empty").style.display = null;
	}
});

showOpen = () => {
	openPosts.start();
	closedPosts.stop();
	openPosts.getPostContainer.style = null;
	closedPosts.getPostContainer.style = "display: none;";
	document.querySelector('button#open').classList.add("active");
	document.querySelector('button#closed').classList.remove("active");
}

showClosed = () => {
	openPosts.stop();
	closedPosts.start();
	openPosts.getPostContainer.style = "display: none;";
	closedPosts.getPostContainer.style = null;
	document.querySelector('button#closed').classList.add("active");
	document.querySelector('button#open').classList.remove("active");
}

profilePostsInit = () => {
	document.querySelector('button#open').onclick = showOpen;
	document.querySelector('button#closed').onclick = showClosed;
	showOpen();
}



