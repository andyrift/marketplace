username = document.querySelector('div.profile').dataset.username;

const openPosts = new getter({ 
	container: document.querySelector('div#open'), 
	params: { 
		quantity: 6,
		exclude: true,
		username: username, 
		closed: false,
	},
	getMethod: getPosts, 
	makeMethod: makePost,
	onEmpty: () => {
		document.querySelector('div#open').querySelector("div.empty").style.display = null;
	}
});

const closedPosts = new getter({ 
	container: document.querySelector('div#closed'), 
	params: { 
		quantity: 6,
		exclude: true,
		username: username, 
		closed: true,
	},
	getMethod: getPosts, 
	makeMethod: makePost,
	onEmpty: () => {
		document.querySelector('div#closed').querySelector("div.empty").style.display = null;
	}
});

showOpen = () => {
	openPosts.start();
	closedPosts.stop();
	openPosts.getContainer.style = null;
	closedPosts.getContainer.style = "display: none;";
	document.querySelector('button#open').classList.add("active");
	document.querySelector('button#closed').classList.remove("active");
}

showClosed = () => {
	openPosts.stop();
	closedPosts.start();
	openPosts.getContainer.style = "display: none;";
	closedPosts.getContainer.style = null;
	document.querySelector('button#closed').classList.add("active");
	document.querySelector('button#open').classList.remove("active");
}

profilePostsInit = () => {
	document.querySelector('button#open').onclick = showOpen;
	document.querySelector('button#closed').onclick = showClosed;
	showOpen();
}



