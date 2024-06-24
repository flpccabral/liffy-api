module.exports = function (app, models) {
	app.get('/subdomain/root/drivers', function (req, res) {
		models.Driver.find()
			.then(function (drivers) {
				res.json(drivers);
			})
			.catch(function (err) {
				throw err;
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
		}})
			.then(function () {
				res.end();
			})
			.catch(function (err) {
				throw err;
			});
	});

	app.delete('/subdomain/root/drivers/:id', function (req, res) {
		models.Travel.remove({
			driver: req.params.id
		})
			.then(function () {
				return models.Driver.remove({
					_id: req.params.id
				});
			})
			.then(function () {
				return models.Driver.find();
			})
			.then(function (drivers) {
				res.json(drivers);
			})
			.catch(function (err) {
				throw err;
			});
	});

	app.get('/subdomain/root/drivers/:id', function (req, res) {
		models.Driver.findOne({
			_id: req.params.id
		})
			.then(function (driver) {
				res.json(driver);
			})
			.catch(function (err) {
				throw err;
			});
	});
};