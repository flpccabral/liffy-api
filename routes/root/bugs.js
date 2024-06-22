module.exports = function (app, models) {
	app.get('/subdomain/root/bugs', function (req, res) {
		models.Bug.find(function (err, bugs) {
			if (err) throw err;
			res.json(bugs);
		});
	});

	app.delete('/subdomain/root/bugs/:id', function (req, res) {
		models.Bug.remove({
			_id: req.params.id
		}, function (err) {
			if (err) throw err;
			models.Bug.find(function (err, bugs) {
				if (err) throw err;
				res.json(bugs);
			});
		});
	});
};