const deleteButton = document.querySelector('a.delete');
if (deleteButton) {
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
}

const favoriteButton = document.querySelector('a#favorite');
if(favoriteButton) {
	const favoriteButtonElement = document.querySelector('button#favorite');
	favoriteButton.addEventListener('click', async (e) => {
		const endpoint = '/favorites/';

		res = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ post_id: favoriteButton.dataset.doc, change: true }),
		})
		data = await res.json();
			
		if(res.status === 200){
			if (data.favorite) {
				favoriteButtonElement.innerHTML = "Remove from favorites";
			} else {
				favoriteButtonElement.innerHTML = "Add to favorites";
			}
		} else {
			document.write(data.body);
		}

	});
}

const closeButton = document.querySelector('a#close');
if (closeButton) {
	const closeButtonElement = document.querySelector('button#close');
	closeButton.addEventListener('click', async (e) => {
		const endpoint = '/post/';

		res = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ post_id: closeButton.dataset.doc, changeClosed: true }),
		})
		data = await res.json();
		if(res.status === 200){
			if (data.closed) {
				closeButtonElement.innerHTML = "Open";
			} else {
				closeButtonElement.innerHTML = "Close";
			}
		} else {
			document.write(data.body);
		}
		
	});
}
/*
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

*/

//favoriteDeleteButton.style.display = "none";
