/*
// check file type
if (!['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'].includes(file.type)) {
  console.log('Only images are allowed.')
  return
}

// check file size (< 2MB)
if (file.size > 2 * 1024 * 1024) {
  console.log('File must be less than 2MB.')
  return
}
*/

const form = document.querySelector('form#createuser');
const usernameBorder = document.querySelector('div#username');
const usernameInput = document.querySelector('input#username');
const pictureInput = document.querySelector('input[type="file"]');
usernameInput.addEventListener("input", () => {usernameBorder.style.borderColor = null});
submitEvent = () => {

	var formData = new FormData(form);
	var data = {};
	formData.forEach((value, key) => data[key] = value);

	if(!data.username || !data.displayname || !data.email || !data.password){
		return;
	}

	fetch('/register/', {
		method: 'POST',
  	body: JSON.stringify(data),
  	headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(res => {
		res.json()
		.then(data => {
			if(res.status < 400){
				if(data.usernameAccepted) {
					fetch('/register/', {
						method: 'POST',
						body: formData,
					})
					.then(res => {
						res.json()
						.then(data => {
							if(res.status < 400){
								window.location.href = data.redirect;
							} else {
								document.write(data.body);
							}
						})
					})
					.catch(err => console.log(err));
				} else {
					usernameBorder.style.borderColor = "red";
				}
			} else {
				document.write(data.body);
			}
		})
	})
	.catch(err => console.log(err));
}