const deleteButton = document.querySelector('a.delete');
deleteButton.addEventListener('click', (e) => {
	const endpoint = `/post/${deleteButton.dataset.doc}`;

	fetch(endpoint, {
		method: 'DELETE'
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status < 400){
				window.location.href = data.redirect;
			} else {
				document.write(data.body);
			}
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
})

const favoriteAddButton = document.querySelector('a#favoriteAdd');
favoriteAddButton.addEventListener('click', (e) => {
	const endpoint = '/favorites/add';

	fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ post_id: favoriteAddButton.dataset.doc }),
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status < 400){
				window.location.href = data.redirect;
			} else {
				document.write(data.body);
			}
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
})

const favoriteDeleteButton = document.querySelector('a#favoriteDelete');
favoriteDeleteButton.addEventListener('click', (e) => {
	const endpoint = '/favorites/';

	fetch(endpoint, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ post_id: favoriteDeleteButton.dataset.doc }),
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status < 400){
				window.location.href = data.redirect;
			} else {
				document.write(data.body);
			}
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
})

//favoriteDeleteButton.style.display = "none";
