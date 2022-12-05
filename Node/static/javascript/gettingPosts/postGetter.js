getPosts = async ({ quantity, username, category_id, excludePostIds, closed, shuffle }, callback) => {
	let searchParams;
	if ('URLSearchParams' in window) {
    searchParams = new URLSearchParams(window.location.search);
  }
	let data = { 
		get: true, 
		quantity, 
		excludePostIds, 
		username, 
		category_id, 
		closed,
		shuffle,
	};
	try {
		res = await fetch("/post/?" + searchParams.toString(), {
			method: 'POST',
	  	body: JSON.stringify(data),
	  	headers: {
				'Content-Type': 'application/json'
			}
		});
		data = await res.json();
		if(res.status === 200){
			callback(data.posts);
		} else {
			document.write(data.body);
		}
	} catch(err) {
		console.log(err)
	}
}

getFavoritePosts = ({ quantity, excludePostIds }, callback) => {
	let data = { 
		get: true, 
		quantity, 
		excludePostIds 
	};
	fetch(/favorites/, {
		method: 'POST',
  	body: JSON.stringify(data),
  	headers: {
		'Content-Type': 'application/json'
	}
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status === 200){
				callback(data.posts);
			} else {
				document.write(data.body);
			}
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
}

class postGetter {
	constructor({ postContainer, postParams, exclude, getPostsMethod, makePostMethod, onEmpty }) {
		this.postContainer = postContainer;
		this.postParams = postParams;
		this.getPostsMethod = getPostsMethod;
		this.makePostMethod = makePostMethod;
		this.postIds = [];
		this.waiting = false;
		this.onEmpty = onEmpty;
	}

	get getPostContainer() {
		return this.postContainer;
	}

	drawPosts = (posts) => {
		posts.forEach(post => {
			this.postIds.push(post.post_id);
			this.postContainer.appendChild(this.makePostMethod(post));
		});
		this.waiting = false;
	}

	checkLoad = () => {
		if (!this.waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
			this.getPosts();
		}
	}

	preLoad = () => {
		if(!this.waiting){
			this.getPosts();
		}
		if(window.innerHeight <= document.body.scrollHeight) {
			clearInterval(this.preloadInterval);
			clearTimeout(this.preloadTimeout);
			this.checkInterval = setInterval(this.checkLoad, 100);
		}
	}

	getPosts = () => {
		if (!this.postParams.quantity) {
			clearInterval(this.checkInterval);
			clearInterval(this.preloadInterval);
			return;
		}
		if (typeof this.postParams.total !== "undefined") {
			if (this.postParams.quantity + this.postIds.length > this.postParams.total) {
				this.postParams.quantity = this.postParams.total - this.postIds.length;
				clearInterval(this.checkInterval);
				clearInterval(this.preloadInterval);
			}
		}
		this.postParams.excludePostIds = this.postParams.exclude ? this.postIds : undefined;
		this.getPostsMethod(this.postParams, (posts) => {
			if(!posts.length){
				clearInterval(this.checkInterval);
				clearInterval(this.preloadInterval);
				if(!this.postIds.length) {
					if(typeof this.onEmpty === "function") {
						this.onEmpty();
					}
				}
				return;
			}
			this.drawPosts(posts);
		});
		this.waiting = true;
	}

	start = () => {
		this.preloadInterval = setInterval(this.preLoad, 100);
		this.preloadTimeout = setTimeout(() => clearInterval(this.preloadInterval) , 5000);
	}

	stop = () => {
		clearInterval(this.checkInterval);
		clearInterval(this.preloadInterval);
		clearTimeout(this.preloadTimeout);
	}
}