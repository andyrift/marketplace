var categories = [];

requestCategories = (callback) => {
	fetch("/categories", {
		method: 'GET',
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status === 200){
				callback(data.categories);
			} else {
				document.write(data.body);
			}
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
}

getCategoriesSorted = (callback) => {
	requestCategories((cats) => {
		categories = cats;
		categories.sort( (a, b) => {return (a.category_id - b.category_id)});
		callback();
	});
}

getCategories = (callback) => {
	requestCategories((cats) => {
		categories = cats;
		callback();
	});
}