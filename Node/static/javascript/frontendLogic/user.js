user_id = document.querySelector('div.profile').dataset.id;

setRating = (rating, done) => {

	const endpoint = window.location.href;

	fetch(endpoint, {
		method: 'POST',
  	body: JSON.stringify({ rating, user_id }),
  	headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status < 400){
				done();
			} else {
				document.write(data.body);
			}
		})
	})
	.catch(err => console.log(err));
}

init(() => {

	let ratingChoose = document.querySelector("#stars");

	if(ratingChoose) {
		rating = parseFloat(ratingChoose.dataset.rating);
		var starRating1 = starRating( {
			starSize:16,
			step:1, 
			rating,
			element: ratingChoose,
			rateCallback: function rateCallback(rating, done) {
				this.setRating(rating); 
				setRating(rating, done);
			}
		});
	}

	let blockButton = document.querySelector('button#block');
	if(blockButton){
		blockButton.onclick = () => {
			if(!confirm('Are you sure you want to delete this user profile?')) {
		      return;
		  }

			const endpoint = `/user/block/` + document.querySelector('div.profile').dataset.username;

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

	let blacklistButton = document.querySelector('button#blacklist');
	if(blacklistButton){
		blacklistButton.onclick = async () => {

			const endpoint = '/blacklist/';

			res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: document.querySelector('div.profile').dataset.username, change: true }),
			});
			data = await res.json();
			if(res.status === 200){
				if (data.blacklisted) {
					blacklistButton.innerHTML = "Remove from blacklist";
				} else {
					blacklistButton.innerHTML = "Add to blacklist";
				}
			} else {
				document.write(data.body);
			}
		}
	}
	
	profilePostsInit();
	
})




