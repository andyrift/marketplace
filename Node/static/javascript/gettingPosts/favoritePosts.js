var postIds = [];

const postContainer = document.querySelector('div.posts');

drawPosts = (posts) => {
	posts.forEach(post => {
		postIds.push(post.post_id);
		postContainer.appendChild(makePost(post));
	});
	waiting = false;
}

var waiting = false

var i = 0;

getFavorites = () => {
	getFavoritePosts({ quantity: 12, excludePostIds: postIds }, (posts) => {
		if(posts.length === 0){
			clearInterval(checkInterval);
			clearInterval(preloadInterval);
		}
		drawPosts(posts);
	});
	waiting = true;
}

checkLoad = () => {
	if (!waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
		getFavorites();
	}
}

var checkInterval;

preLoad = () => {
	if(!waiting){
		getFavorites();
	}
	if(window.innerHeight <= document.body.scrollHeight) {
		clearInterval(preloadInterval);
		clearTimeout(preloadTimeout);
		checkInterval = setInterval(checkLoad, 100);
	}
}

var preloadInterval;

var preloadTimeout;

getCategoriesSorted(() => {
	preloadInterval = setInterval(preLoad, 100);
	preloadTimeout = setTimeout(() => clearInterval(preloadInterval) , 5000);
});