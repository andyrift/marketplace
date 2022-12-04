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

if(document.querySelector("#stars")) {
	rating = parseFloat(document.querySelector("#stars").dataset.rating);
	var starRating1 = starRating( {
		starSize:16,
		step:1, 
		rating,
		element:document.querySelector("#stars"),
		rateCallback: function rateCallback(rating, done) {
			this.setRating(rating); 
			setRating(rating, done);
		}
	});
}


