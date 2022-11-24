path = window.location.pathname.split('/');
username = path[path.length - 1];

var postIds = [];

const openPostContainer = document.querySelector('div#open');
const closedPostContainer = document.querySelector('div#closed');

drawOpenPosts = (posts) => {
	posts.forEach(post => {
		postIds.push(post.post_id);
		openPostContainer.appendChild(makePost(post));
	});
	waiting = false;
}

drawClosedPosts = (posts) => {
	posts.forEach(post => {
		postIds.push(post.post_id);
		closedPostContainer.appendChild(makePost(post));
	});
	waiting = false;
}

var waiting = false

var i = 0;

getUserPosts = () => {
	let postslen = 0;
	getPosts({ quantity: 6, excludePostIds: postIds, username: username, closed: false }, (posts) => {
		postslen += posts.length;
		drawOpenPosts(posts);
	});
	getPosts({ quantity: 6, excludePostIds: postIds, username: username, closed: true }, (posts) => {
		postslen += posts.length;
		drawClosedPosts(posts);
	});
	if(postslen === 0){
		clearInterval(checkInterval);
		clearInterval(preloadInterval);
	}
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
