class getter {
	constructor({ container, params, exclude, getMethod, makeMethod, onEmpty }) {
		this.container = container;
		this.params = params;
		this.getMethod = getMethod;
		this.makeMethod = makeMethod;
		this.ids = [];
		this.waiting = false;
		this.onEmpty = onEmpty;
	}

	get getContainer() {
		return this.container;
	}

	draw = (arr) => {
		arr.forEach(elem => {
			if(typeof elem.dialogue_id !== "undefined") {
				this.ids.push(elem.dialogue_id);
			} else if (typeof elem.post_id !== "undefined") {
				this.ids.push(elem.post_id);
			} else if (typeof elem.message_id !== "undefined") {
				this.ids.push(elem.message_id);
			} else if (typeof elem.user_id !== "undefined") {
				this.ids.push(elem.user_id);
			}  else if (typeof elem.blacklisted_user_id !== "undefined") {
				this.ids.push(elem.blacklisted_user_id);
			}
			this.container.appendChild(this.makeMethod(elem));
		});
		this.waiting = false;
	}

	checkLoad = () => {
		if (!this.waiting && (window.innerHeight + window.pageYOffset + 500) >= document.body.offsetHeight) {
			this.doGet();
		}
	}

	preLoad = () => {
		if(!this.waiting){
			this.doGet();
		}
		if(window.innerHeight <= document.body.scrollHeight) {
			clearInterval(this.preloadInterval);
			clearTimeout(this.preloadTimeout);
			this.checkInterval = setInterval(this.checkLoad, 100);
		}
	}

	doGet = () => {
		if (!this.params.quantity) {
			clearInterval(this.checkInterval);
			clearInterval(this.preloadInterval);
			return;
		}
		if (typeof this.params.total !== "undefined") {
			if (this.params.quantity + this.ids.length > this.params.total) {
				this.params.quantity = this.params.total - this.ids.length;
				clearInterval(this.checkInterval);
				clearInterval(this.preloadInterval);
			}
		}
		this.params.excludeIds = this.params.exclude ? this.ids : undefined;
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
		this.waiting = true;
	}

	start = () => {
		this.preloadInterval = setInterval(this.preLoad, 100);
		this.preloadTimeout = setTimeout(() => clearInterval(this.preloadInterval) , 5000);
	}

	stop = () => {
		clearInterval(this.checkInterval);
		clearInterval(this.preloadInterval);
		clearTimeout(this.preloadTimeout);
	}
}