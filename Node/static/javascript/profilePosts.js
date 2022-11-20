path = window.location.pathname.split('/');
username = path[path.length - 1];

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
	getPosts({ quantity: 6, excludePostIds: postIds, username: username }, (posts) => {
		if(posts.length === 0){
			clearInterval(checkInterval);
		}
		drawPosts(posts);
	});
	waiting = true;
}

checkLoad = () => {
	console.log('check');
	if (!waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
		getUserPosts();
	}
}

var checkInterval;

preLoad = () => {
	console.log('preload');
	if(!waiting){
		getUserPosts();
	}
	if(window.innerHeight <= document.body.scrollHeight) {
		clearInterval(preloadInterval);
		clearTimeout(preloadTimeout);
		checkInterval = setInterval(checkLoad, 100);
	}
}

var preloadInterval = setInterval(preLoad, 100);

var preloadTimeout = setTimeout(() => clearInterval(preloadInterval) , 500);
