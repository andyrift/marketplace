init(() => {

	let img = document.querySelector('img#preview');
	let imgDiv = document.querySelector('div#profilepicture');
	let form = document.querySelector('form#createuser');
	let submitButton = document.querySelector('button#submit');
	let deleteButton = document.querySelector('button#delete');
	let clearButton = document.querySelector('button#clear');

	let original = img.src;

	let displaynameBorder = document.querySelector('div#displayname');

	form.displayname.addEventListener("input", () => {displaynameBorder.style.borderColor = null});

	if (deleteButton) {
		deleteButton.onclick = async () => {
			if(!confirm('Are you sure you want to delete profile picture?')) {
	      return;
	  	}
			res = await fetch('/profile/edit', {
				method: 'DELETE'
			});
			if(res.status === 200) {
				img.src="";
				imgDiv.style.display = 'none';
				original = "";
				document.querySelector('label#change').style.display = 'none';
				document.querySelector('label#choose').style.display = null;
				deleteButton.style.display = 'none';
			}
		}
	}

	onFileChange = () => {
		if(form.picture.files[0]) {
			img.src = URL.createObjectURL(form.picture.files[0]);
		}
		clearButton.style.display = null;
		imgDiv.style.display = null;
		if(deleteButton) {
			deleteButton.style.display = 'none';
		}
		if (!form.picture.value.length) {
			imgDiv.style.display = 'none';
			if(deleteButton) {
				imgDiv.style.display = null;
				img.src = original;
				deleteButton.style.display = null;
				clearButton.style.display = 'none';
			}
		}
	}

	if (clearButton) {
		clearButton.onclick = () => {
			form.picture.value = "";
			onFileChange();
			clearButton.style.display = 'none';
		}
	}

	if(submitButton) {
		submitButton.style.display = null;
		submitButton.onclick = async () => {
			res = await fetch('/profile/edit', {
				method: 'POST',
				body: new FormData(form),
			});
			if(res.status === 200) {
				data = await res.json();
				if (data.errors) {
					if (data.errors.displayname) {
						displaynameBorder.style.borderColor = "red";
					} 
				} else if(data.redirect) {
					window.location.href = data.redirect;
				} else {
					window.location.href = "/";
				}
			}
		}
	}

	form.picture.onchange = onFileChange;
});