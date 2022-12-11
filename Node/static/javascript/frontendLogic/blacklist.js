getBlacklist = async ({ quantity, excludeIds }, callback) => {
	let data = { 
		get: true, 
		quantity, 
		excludeIds: excludeIds,
	};
	try {
		res = await fetch("/blacklist/", {
			method: 'POST',
	  	body: JSON.stringify(data),
	  	headers: {
				'Content-Type': 'application/json'
			}
		});
		data = await res.json();
		if(res.status === 200){
			callback(data.blacklist);
		} else {
			document.write(data.body);
		}
	} catch(err) {
		console.log(err)
	}
}

makeBlacklist = (blacklist) => {

	let div1 = tag('div', { 'class': 'container'});

	let a = tag('a', { 'href': '/user/' + blacklist.username });
	div1.appendChild(a);

	let div2 = tag('div', { 'class': 'left', 'id' : 'profilepicture'});
	a.appendChild(div2);
	let img;

	if (blacklist.user_picture_filename.length) {
		img = tag('img', { 
			'src' : '/' + blacklist.user_picture_filename,  
			'alt' : '', 
			'onerror' : 'this.src="/img/default.jpg"; this.onerror = () => {}'
		})
	} else {
		img = tag('img', { 
			'src' : '/img/default.jpg'
		})
	}
	div2.appendChild(img);

	let div3 = tag('div', { 'class': 'message left' });
	a.appendChild(div3);

	h3 = tag('h3', { 'class': 'left' });
	h3.innerHTML = blacklist.displayname;
	div3.appendChild(h3);

	let div4 = tag('div', { 'class': 'message right' });
	div1.appendChild(div4);

	let button = tag('button');
	button.innerHTML = 'Remove';
	button.onclick = async () => {
		const endpoint = '/blacklist/';

		res = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: blacklist.username, change: true }),
		});
		data = await res.json();
		if(res.status === 200){
			if (data.blacklisted) {
				div1.style.display = null;
			} else {
				div1.style.display = 'none';
			}
		} else {
			document.write(data.body);
		}
	}
	div4.appendChild(button);

	return div1;
}

const blacklistGetter = new getter({ 
	container: document.querySelector('div.blacklist'), 
	params: { 
		quantity: 6,
		exclude: true,
	},
	getMethod: getBlacklist, 
	makeMethod: makeBlacklist,
	onEmpty: () => {
		document.querySelector('div.blacklist').querySelector("div.empty").style.display = null;
	}
});

init(() => {
	blacklistGetter.start();
});