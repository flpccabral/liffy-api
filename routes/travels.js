module.exports = function (app, models, production) {
	app.post('/subdomain/api/travels', function (req, res) {
		models.Travel.create({
			user: req.body.user,
			origin: {
				formatted_address: req.body.origin.formatted_address,
				lat: req.body.origin.lat,
				lng: req.body.origin.lng
			},
			destination: {
				formatted_address: req.body.destination.formatted_address,
				lat: req.body.destination.lat,
				lng: req.body.destination.lng
			},
			type: req.body.type
		})
		.then(function (travel) {
			res.json(travel);
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.get('/subdomain/api/travels/:id', function (req, res) {
		models.Travel.findOne({
			_id: req.params.id
		})
		.populate('user')
		.populate('driver')
		.populate('code')
		.exec()
		.then(function (travel) {
			res.json(travel);
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			distance: req.body.distance,
			observation: req.body.observation
		}}, {new: true})
		.then(function (travel) {
			res.json(travel);
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id/confirm', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			paymentMethod: req.body.paymentMethod,
			date: new Date().getTime()
		}}, {new: true})
		.then(function (travel) {
			res.json(travel);
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id/driver-join', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			driver: req.body.driver
		}})
		.then(function (travel) {
			res.end();
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.delete('/subdomain/api/travels/:id/cancel', function (req, res) {
		models.Travel.remove({
			_id: req.params.id
		})
		.then(function () {
			res.end();
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id/finish', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			done: true,
			elapsedTime: req.body.elapsedTime
		}})
		.then(function (travel) {
			if (travel.paymentMethod === 'paypal') {
				return models.Driver.findOneAndUpdate({
					_id: travel.driver
				}, {$inc: {
					balance: (travel.distance * (travel.type === 'default' ? 1.4 : 2.10) + (travel.type === 'default' ? 2.7 : 4.5)) * 0.8
				}}, {new: true});
			} else {
				return Promise.resolve();
			}
		})
		.then(function (driver) {
			if (driver) {
				res.json(driver);
			} else {
				res.end();
			}
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id/rate', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			rate: {
				stars: req.body.stars,
				comment: req.body.comment
			}
		}})
		.then(function () {
			res.end();
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id/start', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			started: true
		}}, {new: true})
		.then(function () {
			res.end();
		})
		.catch(function (err) {
			throw err;
		});
	});

	app.put('/subdomain/api/travels/:id/insert-promotional-code', function (req, res) {
		models.PromotionalCode.findOne({
			code: req.body.code
		})
		.then(function (code) {
			if (code) {
				if (code.used === true) {
					res.status(400);
					res.send('Code already taken.');
				} else {
					return models.PromotionalCode.findOneAndUpdate({
						code: code.code
					}, {
						used: true
					}, {new: true});
				}
			} else {
				res.status(400);
				res.send('Invalid code.');
			}
		})
		.then(function (code) {
			if (code) {
				return models.Travel.findOneAndUpdate({
					_id: req.params.id
				}, {$set: {
					code: code
				}}, {new: true})
				.populate('user')
				.populate('driver')
				.populate('code')
				.exec();
			}
		})
		.then(function (travel) {
			if (travel) {
				res.json(travel);
			}
		})
		.catch(function (err) {
			throw err;
		});
	});
};