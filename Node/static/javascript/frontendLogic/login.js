init(() => {

	let form = document.querySelector('form#loginuser');
	let usernameBorder = document.querySelector('div#username');
	let passwordBorder = document.querySelector('div#password');

	let submitEvent = async () => {
		try {
			res = await fetch('/login/', {
				method: 'POST',
		  	body: JSON.stringify({ 
		  		username: form.username.value, 
		  		password: form.password.value 
		  	}),
		  	headers: {
					'Content-Type': 'application/json'
				}
			});
			data = await res.json();
			if (res.status < 400) {
				if (data.errors) {
					if (data.errors.username) {
						usernameBorder.style.borderColor = "red";
					} 
					if (data.errors.password) {
						passwordBorder.style.borderColor = "red";
					}
				} else {
					if (data.redirect) {
						window.location.href = data.redirect;
					}
				}
			} else {
				document.write(data.body);
			}
		} catch(err) {
			console.log(err);
		};
	}

	form.username.addEventListener("input", () => {usernameBorder.style.borderColor = null});
	form.password.addEventListener("input", () => {passwordBorder.style.borderColor = null});
	document.querySelector('button.forminput').onclick = submitEvent;
});