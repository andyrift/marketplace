init(() => {
	let deleteButton = document.querySelector('button.delete');
	deleteButton.onclick = () => {
		if(!confirm('Are you sure you want to delete your profile?')) {
	      return;
	  }

		const endpoint = `/profile`;

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
	}

	profilePostsInit();

})

