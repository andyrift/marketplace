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
});