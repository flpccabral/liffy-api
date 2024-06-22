module.exports = function (app, models) {
	app.post('/subdomain/api/bugs', function (req, res) {
		models.Bug.create({
			info: req.body.info,
			sentAt: new Date().getTime()
		}, function (err) {
			if (err) throw err;
			res.end();
		});
	});
};