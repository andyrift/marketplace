getPosts = async ({ quantity, username, category_id, excludeIds, closed, shuffle }, callback) => {
	let searchParams;
	if ('URLSearchParams' in window) {
    searchParams = new URLSearchParams(window.location.search);
  }
	let data = { 
		get: true, 
		quantity, 
		excludePostIds: excludeIds, 
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
			callback(data.result);
		} else {
			document.write(data.body);
		}
	} catch(err) {
		console.log(err)
	}
}

getFavoritePosts = ({ quantity, excludeIds }, callback) => {
	let data = { 
		get: true, 
		quantity, 
		excludePostIds: excludeIds,
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