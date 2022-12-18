let avgrating = parseFloat(document.querySelector("#average").dataset.rating);
document.querySelector("span.average").textContent = avgrating.toFixed(1);

var avgRating = starRating( {
	starSize:25,
	step:0.1, 
	rating: avgrating,
	disabled:true,
	element:document.querySelector("#average"), 
	rateCallback: function rateCallback(rating, done) {
		this.setRating(rating); 
		setRating(rating, done);
	}
});