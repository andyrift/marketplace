getDialogues = async ({ quantity, username, excludeIds }, callback) => {
	let data = { 
		get: true, 
		quantity, 
		excludeIds: excludeIds, 
		username,
	};
	try {
		res = await fetch("/messages/", {
			method: 'POST',
	  	body: JSON.stringify(data),
	  	headers: {
				'Content-Type': 'application/json'
			}
		});
		data = await res.json();
		if(res.status === 200){
			callback(data.dialogues);
		} else {
			document.write(data.body);
		}
	} catch(err) {
		console.log(err)
	}
}

makeDialogue = (dialogue) => {

	let dialogueElement = tag('a', { 'href': '/chat/' + dialogue.dialogue_id });

	let div1 = tag('div', { 'class': 'container'});
	dialogueElement.appendChild(div1);

	let div2 = tag('div', { 'class': 'left', 'id' : 'profilepicture'});
	div1.appendChild(div2);

	img = tag('img', { 
		'src' : '/' + dialogue.user_picture_filename,  
		'alt' : '', 
		'onerror' : 'this.src="/img/default.jpg"; this.onerror = () => {}'
	})
	div2.appendChild(img);

	let div3 = tag('div', { 'class': 'left' });
	div1.appendChild(div3);

	h3 = tag('h3');
	h3.innerHTML = dialogue.displayname;
	div3.appendChild(h3);
	
	h4 = tag('h4');
	h4.innerHTML = dialogue.title;
	div3.appendChild(h4);

	p = tag('p');
	p.innerHTML = dialogue.message_body;
	div3.appendChild(p);

	return dialogueElement;
}

const dialoguesGetter = new getter({ 
	container: document.querySelector('div.dialogues'), 
	params: { 
		quantity: 6,
		exclude: true,
	},
	getMethod: getDialogues, 
	makeMethod: makeDialogue,
	onEmpty: () => {
		document.querySelector('div.dialogues').querySelector("div.empty").style.display = null;
	}
});

init(() => {
	dialoguesGetter.start();
})