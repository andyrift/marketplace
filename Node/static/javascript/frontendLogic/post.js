const deleteButton = document.querySelector('a.delete');
const favoriteButton = document.querySelector('a#favorite');
const closeButton = document.querySelector('a#close');

init(() => {
	if (deleteButton) {
		deleteButton.addEventListener('click', (e) => {
			if(!confirm('Are you sure you want to delete the post?')) {
	        return;
	    }

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

	if (closeButton) {
		const postPage = document.querySelector('div.postpage');
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
					postPage.classList.add("closed");
					document.querySelector('#closed-alert').style.display=null;
				} else {
					closeButtonElement.innerHTML = "Close";
					postPage.classList.remove("closed");
					document.querySelector('#closed-alert').style.display="none";
				}
			} else {
				document.write(data.body);
			}
			
		});
	}
})


