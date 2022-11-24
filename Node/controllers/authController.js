module.exports.signup_get = (req, res) => {
	res.render('signup', { title: 'Sign up' });
}

module.exports.login_get = (req, res) => {
	res.render('login', { title: 'Log in' });
}

module.exports.logout_get = (req, res) => {
	res.send();
}

module.exports.signup_post = (req, res) => {
	res.send();
}

module.exports.login_post = (req, res) => {
	res.send();
}