const select = document.querySelector('select#category');

makeOption = (category) => {

	var option = tag('option', { 'value': `${category.category_id}` });
	option.innerHTML = `${category.category_name}`;
	
	return option;
}

init(() => {
	categories.forEach(category => select.appendChild(makeOption(category)));
	document.querySelector('input.forminput').style.display = null;
}); 
