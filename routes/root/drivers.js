module.exports = function (app, models) {
	app.get('/subdomain/root/drivers', function (req, res) {
		models.Driver.find(function (err, drivers) {
			if (err) throw err;
			res.json(drivers);
		});
	});

	app.put('/subdomain/root/drivers/:id', function (req, res) {
		models.Driver.findOneAndUpdate({
			_id: req.params.id	
		}, {$set: {
			active: req.body.active,
			type: req.body.type,
			email: req.body.email,
			phone: req.body.phone,
			cpf: req.body.cpf
		}}, function (err) {
			if (err) throw err;
			res.end();
		});
	});

	app.delete('/subdomain/root/drivers/:id', function (req, res) {
		models.Travel.remove({
			driver: req.params.id
		}, function (err) {
			if (err) throw err;
			models.Driver.remove({
				_id: req.params.id
			}, function (err) {
				if (err) throw err;
				models.Driver.find(function (err, drivers) {
					if (err) throw err;
					res.json(drivers);
				});
			});
		});
	});

	app.get('/subdomain/root/drivers/:id', function (req, res) {
		models.Driver.findOne({
			_id: req.params.id
		}, function (err, driver) {
			if (err) throw err;
			res.json(driver);
		});
	});
};