class messageGetter {
	constructor({ container, params, onEmpty }) {
		this.container = container;
		this.params = params;
		this.ids = [];
		this.waitingDown = false;
		this.waitingUp = false;
		this.onEmpty = onEmpty;
		this.user_id = parseInt(container.dataset.user_id);
	}

	get getContainer() {
		return this.container;
	}

	makeMessage = (message) => {

		let messageElement 

		if(message.sender_id === this.user_id) {
			messageElement = tag('div', { 'class': 'message right' });
		} else {
			messageElement = tag('div', { 'class': 'message left' });
		}

		let div1 = tag('div', { 'class': 'left', 'id' : 'profilepicture'});
		messageElement.appendChild(div1);

		let img = tag('img', { 
			'src' : '/' + message.user_picture_filename,  
			'alt' : '', 
			'onerror' : 'this.src="/img/default.jpg"; this.onerror = () => {}'
		})
		div1.appendChild(img);

		let h3 = tag('h3', { 'class': 'name' });
		h3.innerHTML = message.displayname;
		messageElement.appendChild(h3);
		
		let timestamp = new Date(message.send_timestamp).toString().split(' ')[4];

		timestamp = timestamp.split(':');

		timestamp = timestamp[0] + ':' + timestamp[1];

		let p = tag('p', { 'class': 'time' });
		p.innerHTML = timestamp;
		messageElement.appendChild(p);

		let div2 = tag('div', { 'class': 'body' });
		div2.innerHTML = message.message_body;
		messageElement.appendChild(div2);

		return messageElement;
	}

	getMessages = async ({ top }, { quantity, lastUp, lastDown }, callback) => {
		let data = { 
			get: true, 
			top,
			quantity, 
			lastUp,
			lastDown
		};
		try {
			let res = await fetch(window.location.href, {
				method: 'POST',
		  	body: JSON.stringify(data),
		  	headers: {
					'Content-Type': 'application/json'
				}
			});
			data = await res.json();
			if(res.status === 200){
				callback(data.messages);
			} else {
				document.write(data.body);
			}
		} catch(err) {
			console.log(err)
		}
	}

	drawDown = (arr) => {
		arr.forEach(elem => {
			this.params.lastDown = elem.message_id;
			this.container.append(this.makeMessage(elem));
		});
	}

	drawUp = (arr) => {
		arr.forEach(elem => {
			this.params.lastUp = elem.message_id;
			if(typeof this.params.lastDown === 'undefined') {
				this.params.lastDown = elem.message_id;
			}
			this.container.prepend(this.makeMessage(elem));
		});
		if (typeof this.downInterval === 'undefined') {
			this.downInterval = setInterval(this.checkDown, 1000);
		}
	}

	checkUp = () => {
		if (!this.waitingUp) {
			this.waitingUp = true;
			if(this.container.scrollTop < 200) {
				this.getMessages({ top: true }, this.params, (arr) => {
					if(arr.length){
						if(typeof this.params.lastDown === 'undefined') {
							this.drawUp(arr);
							this.container.scrollTop = this.container.scrollHeight - this.container.offsetHeight;
						} else {
							let scroll = this.container.scrollTop;
							let height = this.container.scrollHeight;
							this.drawUp(arr);
							this.container.scrollTop = scroll + this.container.scrollHeight - height;
						}
					}
					this.waitingUp = false;
				});
			} else {
				this.waitingUp = false;
			}
		}
	}

	checkDown = () => {
		if (!this.waitingDown) {
			this.waitingDown = true;
			this.getMessages({ top: false }, this.params, (arr) => {
				if(arr.length){
					if(this.container.scrollTop > this.container.scrollHeight - this.container.offsetHeight - 100) {
						this.drawDown(arr);
						this.container.scrollTop = this.container.scrollHeight - this.container.offsetHeight
					} else {
						this.drawDown(arr);
					}
				}
				this.waitingDown = false;
			});
		}
	}
/*
	doGet = () => {
		if (!this.params.quantity) {
			clearInterval(this.checkInterval);
			clearInterval(this.preloadInterval);
			return;
		}
		this.params.lastId = this.params.exclude ? this.ids : undefined;
		this.getMethod(this.params, (arr) => {
			if(!arr.length){
				clearInterval(this.checkInterval);
				clearInterval(this.preloadInterval);
				if(!this.ids.length) {
					if(typeof this.onEmpty === "function") {
						this.onEmpty();
					}
				}
				return;
			}
			this.draw(arr);
		});
	}
*/
	start = () => {
		this.upInterval = setInterval(this.checkUp, 1000);
		this.container.scrollTop = this.container.scrollHeight - this.container.offsetHeight;
		if (!this.params.quantity || this.params.quantity < 0) {
			this.params.quantity = 20
		}
	}

	stop = () => {
		clearInterval(this.downInterval);
		clearInterval(this.upInterval);
	}
}


init(() => {
	let sendButton = document.querySelector('button#sendbutton');
	let form = document.querySelector('form#sendform');
	if(sendButton) {
		sendButton.onclick = async () => {
			if(form.message.value && form.message.value.length) {
				let data = {
					send: true,
					message_body: form.message.value,
				}
				form.message.value = null;
				res = await fetch(window.location.href, {
					method: 'POST',
			  	body: JSON.stringify(data),
			  	headers: {
						'Content-Type': 'application/json'
					}
				});
				data = await res.json();
				if(res.status === 200){
					//notError
				} else {
					//error
				}
				
			}
		}
	}

	chatGetter = new messageGetter({
		container: document.querySelector('div.chat-messages'),
		params: {
			quantity: 5
		},
		onEmpty: () => {}
	})

	chatGetter.start();
})