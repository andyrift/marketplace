const deleteButton = document.querySelector('a.delete');
deleteButton.addEventListener('click', (e) => {
	const endpoint = `/profile/${deleteButton.dataset.doc}`;

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
	})
	.catch(err => console.log(err));
})