getPosts = ({ quantity, username, category_id, excludePostIds, closed }, callback) => {
	let data = { quantity, excludePostIds, username, category_id, get: true, closed };
	fetch(/post/, {
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