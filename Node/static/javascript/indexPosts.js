var categories = [];

var postIds = [];

const endpoint = `/post/`;

tag = (name, attrs) => {
  var element = document.createElement(name.toString());

  !!attrs && Object.keys(attrs).forEach(function(key) {
    element.setAttribute(key, attrs[key]);
  });

  return element;
}

const postContainer = document.querySelector('div.posts');

makePost = (post) => {
	postIds.push(post.post_id);

	var postElement = tag('div', { 'class': 'post' });
	var a = tag('a', { 'href': `/post/${post.post_id}`});

	var img = tag('div', { 'id': 'image' });
	a.appendChild(img);

	var content = tag('div', { 'id': 'content' });
	a.appendChild(content);

	var h3 = tag('h4', { 'id': 'title' });
	h3.innerHTML = `${post.title}`;
	content.appendChild(h3);

	var h3 = tag('h3');
	h3.innerHTML = `$${post.price}`;
	content.appendChild(h3);

	var p = tag('p', { 'id': 'address' });
	p.innerHTML = `${post.address}`;
	content.appendChild(p);

	//var p = tag('p', { 'id': 'category' });
	//p.innerHTML = `${categories.find(cat => {return cat.category_id === post.category_id}).category_name}`;
	//content.appendChild(p);

	postElement.appendChild(a);
	return postElement;
}

drawPosts = (posts) => {
	posts.forEach(post => {
		postContainer.appendChild(makePost(post));
	});
	waiting = false;
}

var waiting = false

getPosts = (quantity) => {
	waiting = true;
	let data = { quantity: quantity, postIds: postIds };
	fetch(endpoint, {
	method: 'POST',
  	body: JSON.stringify(data),
  	headers: {
		'Content-Type': 'application/json'
	}
	})
	.then((res) => res.json())
	.then((data) => {
		drawPosts(data.posts);
	})
	.catch(err => console.log(err));
}

var i = 0;

checkLoad = () => {
	if (!waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
		getPosts(6);
	}
}

var checkInterval;

preLoad = () => {
	if(!waiting){
		getPosts(6);
	}
	if(window.innerHeight <= document.body.scrollHeight) {
		clearInterval(preloadInterval);
		clearTimeout(preloadTimeout);
		checkInterval = setInterval(checkLoad, 100);
	}
}

var preloadInterval;

var preloadTimeout;

fetch("/categories", {
	method: 'GET',
})
.then((res) => res.json())
.then((data) => {
	categories = data.categories;
	categories.sort( (a, b) => {return (a.category_id - b.category_id)});
	preloadInterval = setInterval(preLoad, 100);
	preloadTimeout = setTimeout(() => clearInterval(preloadInterval) , 5000);
})
.catch(err => console.log(err));