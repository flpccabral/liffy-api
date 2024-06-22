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
		}, function (err, travel) {
			if (err) throw err;
			res.json(travel);
		});
	});

	app.get('/subdomain/api/travels/:id', function (req, res) {
		models.Travel.findOne({
			_id: req.params.id
		})
		.populate('user')
		.populate('driver')
		.populate('code')
			.exec(function (err, travel) {
				if (err) throw err;
				res.json(travel);
			});
	});

	app.put('/subdomain/api/travels/:id', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			distance: req.body.distance,
			observation: req.body.observation
		}}, {new: true}, function (err, travel) {
			if (err) throw err;
			res.json(travel);
		});
	});

	app.put('/subdomain/api/travels/:id/confirm', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			paymentMethod: req.body.paymentMethod,
			date: new Date().getTime()
		}}, {new: true}, function (err, travel) {
			if (err) throw err;
			res.json(travel);
		});
	});

	app.put('/subdomain/api/travels/:id/driver-join', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			driver: req.body.driver
		}}, function (err, travel) {
			if (err) throw err;
			res.end();
		});
	});

	app.delete('/subdomain/api/travels/:id/cancel', function (req, res) {
		models.Travel.remove({
			_id: req.params.id
		}, function (err) {
			if (err) throw err;
			res.end();
		});
	});

	app.put('/subdomain/api/travels/:id/finish', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			done: true,
			elapsedTime: req.body.elapsedTime
		}}, function (err, travel) {
			if (err) throw err;
			if (travel.paymentMethod === 'paypal') {
				models.Driver.findOneAndUpdate({
					_id: travel.driver
				}, {$inc: {
					balance: (travel.distance * (travel.type === 'default' ? 1.4 : 2.10) + (travel.type === 'default' ? 2.7 : 4.5)) * 0.8
				}}, {new: true}, function (err, driver) {
					if (err) throw err;
					res.json(driver);
				});
			} else {
				res.end();
			};
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
		}}, function (err) {
			if (err) throw err;
			res.end();
		});
	});

	app.put('/subdomain/api/travels/:id/start', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			started: true
		}}, {new: true}, function (err) {
			if (err) throw err;
			res.end();
		});
	});

	app.put('/subdomain/api/travels/:id/insert-promotional-code', function (req, res) {
		models.PromotionalCode.findOne({
			code: req.body.code
		}, function (err, code) {
			if (err) throw err;
			if (code) {
				if (code.used === true) {
					res.status(400);
					res.send('Code already taken.');
				} else {
					models.PromotionalCode.findOneAndUpdate({
						code: code.code
					}, {
						used: true
					}, {new: true}, function (err, code) {
						if (err) throw err;
						models.Travel.findOneAndUpdate({
							_id: req.params.id
						}, {$set: {
							code: code
						}}, {new: true})
							.populate('user')
							.populate('driver')
							.populate('code')
								.exec(function (err, travel) {
									if (err) throw err;
									res.json(travel);
								});
					});
				};
			} else {
				res.status(400);
				res.send('Invalid code.');
			};
		});
	});
};