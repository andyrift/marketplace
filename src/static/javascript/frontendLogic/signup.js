init(() => {

	let form = document.querySelector('form#createuser');
	let usernameBorder = document.querySelector('div#username');
	let displaynameBorder = document.querySelector('div#displayname');
	let passwordBorder = document.querySelector('div#password');
	let img = document.querySelector('img#preview');
	let imgDiv = document.querySelector('div#profilepicture');
	let clearButton = document.querySelector('button#clear');

	submitEvent = async () => {
		var formData = new FormData(form);
		try {
			res = await fetch('/signup/', {
				method: 'POST',
				body: formData,
			})
			data = await res.json();
			if (res.status < 400) {
				if (data.errors) {
					if (data.errors.username) {
						usernameBorder.style.borderColor = "red";
					} 
					if (data.errors.displayname) {
						displaynameBorder.style.borderColor = "red";
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

	onFileChange = () => {
		if(form.picture.files[0]) {
			img.src = URL.createObjectURL(form.picture.files[0]);
		}
		imgDiv.style.display = null;
		clearButton.style.display = null;
		if (!form.picture.value.length) {
			imgDiv.style.display = 'none';
			clearButton.style.display = 'none';
		}
	}

	if (clearButton) {
		clearButton.onclick = () => {
			form.picture.value = "";
			onFileChange();
			clearButton.style.display = 'none';
		}
	}

	form.username.addEventListener("input", () => {usernameBorder.style.borderColor = null});
	form.displayname.addEventListener("input", () => {displaynameBorder.style.borderColor = null});
	form.password.addEventListener("input", () => {passwordBorder.style.borderColor = null});
	document.querySelector('button.forminput').onclick = submitEvent;

	form.picture.onchange = onFileChange;

});