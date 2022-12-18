const select = document.querySelector('select#category');

const selected = select.dataset.cat;

makeOption = (category) => {

	let option;

	if(selected == category.category_id){
		option = tag('option', { 'value': `${category.category_id}`, 'selected': 'selected' });
	} else {
		option = tag('option', { 'value': `${category.category_id}` });
	}
	option.innerHTML = `${category.category_name}`;
	
	return option;
}

init(() => {
	categories.forEach(category => select.appendChild(makeOption(category)));

	let img = document.querySelector('img#preview');
	let form = document.querySelector('form#createpost');
	let submitButton = document.querySelector('button#submit');
	let deleteButton = document.querySelector('button#delete');
	let clearButton = document.querySelector('button#clear');

	let original = img.src;

	let titleBorder = document.querySelector('div#title');
	let priceBorder = document.querySelector('div#price');

	form.title.addEventListener("input", () => {titleBorder.style.borderColor = null});
	form.price.addEventListener("input", () => {priceBorder.style.borderColor = null});

	if (deleteButton) {
		deleteButton.onclick = async () => {
			if(!confirm('Are you sure you want to delete post picture?')) {
	      return;
	  	}
			res = await fetch('/post/edit/' + form.dataset.post_id, {
				method: 'DELETE'
			});
			if(res.status === 200) {
				img.src="";
				img.style.display = 'none';
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
		img.style.display = null;
		if(deleteButton) {
			deleteButton.style.display = 'none';
		}
		if (!form.picture.value.length) {
			img.style.display = 'none';
			if(deleteButton) {
				img.style.display = null;
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
			res = await fetch('/post/edit/' + form.dataset.post_id, {
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
			}
		}
	}

	form.picture.onchange = onFileChange;
});