makePost = (post) => {
	var postElement = tag('div', { 'class': 'post' });
	var a = tag('a', { 'href': `/post/${post.post_id}`});

	var img = tag('div', { 'id': 'image' });
	a.appendChild(img);

	img.innerHTML = `<img src="/${post.picture_filename}" alt="Post Picture">`;

	var content = tag('div', { 'id': 'content' });
	a.appendChild(content);

	var title = tag('h4', { 'id': 'title' });
	title.innerHTML = `${post.title}`;
	content.appendChild(title);

	var price = tag('h3');
	price.innerHTML = `$${post.price}`;
	content.appendChild(price);

	var address = tag('p', { 'id': 'address' });
	address.innerHTML = `${post.address}`;
	content.appendChild(address);

	//var p = tag('p', { 'id': 'category' });
	//p.innerHTML = `${categories.find(cat => {return cat.category_id === post.category_id}).category_name}`;
	//content.appendChild(p);

	postElement.appendChild(a);
	return postElement;
}