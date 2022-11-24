module.exports.sendError = (res) => {
	res.app.render('500', { title: 'Error' }, (err, html) => {
		if (err) {
			console.error(err);
			res.status(500).json({ body: "<h1>500</h1><h2>An error occured</h2>" });
		} else {
			res.status(500).json({ body: html });
		}
	});
}