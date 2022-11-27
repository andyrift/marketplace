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
document.querySelector('input#username').addEventListener("input", () => {usernameBorder.style.borderColor = null});
const displaynameBorder = document.querySelector('div#displayname');
document.querySelector('input#displayname').addEventListener("input", () => {displaynameBorder.style.borderColor = null});
const passwordBorder = document.querySelector('div#password');
document.querySelector('input#password').addEventListener("input", () => {passwordBorder.style.borderColor = null});

submitEvent = async () => {
	var formData = new FormData(form);
	try {
		res = await fetch('/signup/', {
			method: 'POST',
			body: formData,
		})
		data = await res.json();
		if (res.status < 400) {
			if (data.errors) {
				if (data.errors.username) {
					usernameBorder.style.borderColor = "red";
				} 
				if (data.errors.displayname) {
					displaynameBorder.style.borderColor = "red";
				}
				if (data.errors.password) {
					passwordBorder.style.borderColor = "red";
				}
			} else {
				if (data.redirect) {
					window.location.href = data.redirect;
				}
			}
		} else {
			document.write(data.body);
		}
	} catch(err) {
		console.log(err);
	};
}