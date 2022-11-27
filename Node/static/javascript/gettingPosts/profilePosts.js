username = document.querySelector('div.profile').dataset.username;

console.log(username);

var postIds = [];

var waiting = false

const openPostContainer = document.querySelector('div#open');
var openCheckInterval;

drawOpenPosts = (posts) => {
	posts.forEach(post => {
		postIds.push(post.post_id);
		openPostContainer.appendChild(makePost(post));
	});
	waiting = false;
}

getOpenPosts = () => {
	let postslen = 0;
	getPosts({ quantity: 6, excludePostIds: postIds, username: username, closed: false }, (posts) => {
		postslen += posts.length;
		drawOpenPosts(posts);
	});
	if(postslen === 0){
		clearInterval(openCheckInterval);
		clearInterval(openPreloadInterval);
	}
	waiting = true;
}

openCheckLoad = () => {
	console.log('check');
	if (!waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
		getOpenPosts();
	}
}

openPreLoad = () => {
	console.log('preload');
	if(!waiting){
		getOpenPosts();
	}
	if(window.innerHeight <= document.body.scrollHeight) {
		clearInterval(openPreloadInterval);
		clearTimeout(openPreloadTimeout);
		openCheckInterval = setInterval(openCheckLoad, 100);
	}
}

var openPreloadInterval = setInterval(openPreLoad, 100);

var openPreloadTimeout = setTimeout(() => clearInterval(openPreloadInterval) , 500);



const closedPostContainer = document.querySelector('div#closed');

var closedCheckInterval;

drawClosedPosts = (posts) => {
	posts.forEach(post => {
		postIds.push(post.post_id);
		closedPostContainer.appendChild(makePost(post));
	});
	waiting = false;
}

getClosedPosts = () => {
	let postslen = 0;
	getPosts({ quantity: 6, excludePostIds: postIds, username: username, closed: true }, (posts) => {
		postslen += posts.length;
		drawClosedPosts(posts);
	});
	if(postslen === 0){
		clearInterval(closedCheckInterval);
		clearInterval(closedPreloadInterval);
	}
	waiting = true;
}

closedCheckLoad = () => {
	console.log('check');
	if (!waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
		getClosedPosts();
	}
}

closedPreLoad = () => {
	console.log('preload');
	if(!waiting){
		getClosedPosts();
	}
	if(window.innerHeight <= document.body.scrollHeight) {
		clearInterval(closedPreloadInterval);
		clearTimeout(closedPreloadTimeout);
		closedCheckInterval = setInterval(closedCheckLoad, 100);
	}
}

var closedPreloadInterval = setInterval(closedPreLoad, 100);

var closedPreloadTimeout = setTimeout(() => clearInterval(closedPreloadInterval) , 500);
