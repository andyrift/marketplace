const select = document.querySelector('select#category');

makeOption = (category) => {

	var option = tag('option', { 'value': `${category.category_id}` });
	option.innerHTML = `${category.category_name}`;
	
	return option;
}

init(() => {
	//action="/post/create" method="POST" enctype="multipart/form-data"

	categories.forEach(category => select.appendChild(makeOption(category)));

	let img = document.querySelector('img#preview');
	let form = document.querySelector('form#createpost');
	let submitButton = document.querySelector('button#submit');
	let clearButton = document.querySelector('button#clear');

	let titleBorder = document.querySelector('div#title');
	let priceBorder = document.querySelector('div#price');

	document.querySelector('input#title').addEventListener("input", () => {titleBorder.style.borderColor = null});
	document.querySelector('input#price').addEventListener("input", () => {priceBorder.style.borderColor = null});

	if(submitButton) {
		submitButton.style.display = null;
		submitButton.onclick = async () => {
			res = await fetch('/post/create', {
				method: 'POST',
				body: new FormData(form),
			});
			if(res.status === 200) {
				data = await res.json();
				if (data.errors) {
					if (data.errors.title) {
						titleBorder.style.borderColor = "red";
					} 
					if (data.errors.price) {
						priceBorder.style.borderColor = "red";
					}
				} else if(data.redirect) {
					window.location.href = data.redirect;
				} else {
					window.location.href = "/";
				}
			} else {
				document.write(data.body);
			}
		}
	}

	onFileChange = () => {
		if(form.picture.files[0]) {
			img.src = URL.createObjectURL(form.picture.files[0]);
		}
		img.style.display = null;
		clearButton.style.display = null;
		if (!form.picture.value.length) {
			img.style.display = 'none';
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

	form.picture.onchange = onFileChange;
}); 
