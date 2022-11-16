var categories = [];

const select = document.querySelector('select#category');
tag = (name, attrs) => {
  var element = document.createElement(name.toString());

  !!attrs && Object.keys(attrs).forEach(function(key) {
    element.setAttribute(key, attrs[key]);
  });

  return element;
}
makeOption = (category) => {

	var option = tag('option', { 'value': `${category.category_id}` });
	option.innerHTML = `${category.category_name}`;
	
	return option;
}

fetch("/categories", {
	method: 'GET',
})
.then((res) => res.json())
.then((data) => {
	categories = data.categories;
	categories.sort( (a, b) => {return (a.category_id - b.category_id)});
	categories.forEach(category => select.appendChild(makeOption(category)));
})
.catch(err => console.log(err));