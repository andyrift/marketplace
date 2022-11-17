path = window.location.pathname.split('/');
user_id = parseInt(path[path.length - 1]);

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

getUserPosts = () => {
	getPosts({ quantity: 6, excludePostIds: postIds, user_id: user_id }, (posts) => {
		drawPosts(posts);
	});
	waiting = true;
}

checkLoad = () => {
	if (!waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
		getUserPosts();
	}
}

var checkInterval;

preLoad = () => {
	if(!waiting){
		getUserPosts();
	}
	if(window.innerHeight <= document.body.scrollHeight) {
		clearInterval(preloadInterval);
		clearTimeout(preloadTimeout);
		checkInterval = setInterval(checkLoad, 100);
	}
}

var preloadInterval;

var preloadTimeout;

preloadInterval = setInterval(preLoad, 100);
preloadTimeout = setTimeout(() => clearInterval(preloadInterval) , 5000);