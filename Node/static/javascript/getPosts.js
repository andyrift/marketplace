getPosts = ({ quantity, username, category_id, excludePostIds }, callback) => {
	let data = { quantity, excludePostIds, username, category_id };
	fetch(/post/, {
		method: 'POST',
  	body: JSON.stringify(data),
  	headers: {
		'Content-Type': 'application/json'
	}
	})
	.then((res) => res.json())
	.then((data) => {
		callback(data.posts);
	})
	.catch(err => console.log(err));
}