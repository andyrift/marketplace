init(() => {

	let deleteButton = document.querySelector('a.delete');
	let favoriteButton = document.querySelector('a#favorite');
	let closeButton = document.querySelector('a#close');

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
		let favoriteButtonElement = document.querySelector('button#favorite');
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
		let postPage = document.querySelector('div.postpage');
		let closeButtonElement = document.querySelector('button#close');
		let closedAlert = document.querySelector('#closed-alert');
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
					closedAlert.style.display=null;
				} else {
					closeButtonElement.innerHTML = "Close";
					postPage.classList.remove("closed");
					closedAlert.style.display="none";
				}
			} else {
				document.write(data.body);
			}
		});
	}

	let blockButton = document.querySelector('button#block');
	if(blockButton){
		blockButton.onclick = () => {
			if(!confirm('Are you sure you want to delete this post?')) {
		      return;
		  }

			const endpoint = `/post/block/` + blockButton.dataset.id;

			fetch(endpoint, {
				method: 'POST'
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
		}
	}

	let writeButton = document.querySelector('button#write');
	if(writeButton) {
		let container = document.querySelector('div.postmessage');
		writeButton.onclick = async () => {
			if (container.style.display) {
				let data = {
					check: true,
					post_id: writeButton.dataset.post_id
				}
				res = await fetch('/messages/', {
					method: 'POST',
			  	body: JSON.stringify(data),
			  	headers: {
						'Content-Type': 'application/json'
					}
				});
				data = await res.json();
				if(res.status === 200){
					if (data.redirect) {
						window.location.href = data.redirect;
					} else {
						container.style.display = null;
					}
				} else {
					//error
				}
			}
			
		}
	}

	let cancelButton = document.querySelector('button#cancel');
	if(cancelButton) {
		let container = document.querySelector('div.postmessage');
		cancelButton.onclick = () => {
			container.style.display = 'none';
		}
	}

	let sendButton = document.querySelector('button#sendbutton');
	let form = document.querySelector('form#sendform');
	if(sendButton) {
		sendButton.onclick = async () => {
			if(form.message.value && form.message.value.length) {
				console.log(form.message.value);
				let data = {
					send: true,
					message_body: form.message.value,
					post_id: sendButton.dataset.post_id
				}
				form.message.value = null;
				res = await fetch('/chat/', {
					method: 'POST',
			  	body: JSON.stringify(data),
			  	headers: {
						'Content-Type': 'application/json'
					}
				});
				data = await res.json();
				if(res.status === 200){
					if (data.redirect) {
						window.location.href = data.redirect;
					}
				} else {
					//error
				}
				
			}
		}
	}

})


