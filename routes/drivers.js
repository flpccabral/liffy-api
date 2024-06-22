module.exports = function (app, models, password, fs, emailServer, production) {
	app.post('/subdomain/api/drivers', function (req, res) {
		models.Driver.findOne({$or: [{
			email: req.body.email
		}, {
			phone: req.body.phone
		}, {
			cpf: req.body.cpf
		}]}, function (err, driver) {
			if (err) throw err;
			if (driver) {
				res.status(400);
				if (driver.email === req.body.email) {
					res.send('Email already taken.');
				} else {
					if (driver.cpf == req.body.cpf) {
						res.send('CPF already taken.');
					} else {
						res.send('Phone already taken.');
					};
				};
			} else {
				password(req.body.password).hash(function (err, password) {
					if (err) throw err;
					function capitalizeName (name) {
						return name
							.toLowerCase()
							.split(' ')
							.map(function (word) {
								return word[0].toUpperCase() + word.substr(1);
							})
							.join(' ')
					};
					models.Driver.create({
						name: capitalizeName(req.body.name),
						email: req.body.email,
						phone: req.body.phone,
						password: password,
						photo: 'images/user-default.png',
						cpf: req.body.cpf,
						registeredAt: new Date().getTime()
					}, function (err, driver) {
						if (err) throw err;
						res.end();
					});
				});
			};
		});
	});

	app.post('/subdomain/api/drivers/login', function (req, res) {
		models.Driver.findOne({
			email: req.body.email
		}, function (err, driver) {
			if (err) throw err;
			if (driver) {
				password(req.body.password).verifyAgainst(driver.password, function (err, verified) {
					if (err) throw err;
					if (verified) {
						if (driver.active) {
							res.json(driver);
						} else {
							res.status(400);
							res.send('Driver not active.');
						};
					} else {
						res.status(400);
						res.send('Invalid login.');
					};
				});
			} else {
				res.status(400);
				res.send('Invalid login.');
			};
		});
	});

	app.put('/subdomain/api/drivers/photo', function (req, res) {
		var _fileName = req.body.id + new Date().getTime() + '.png';
		fs.writeFile('static/photos/' + _fileName, req.body.photo, 'base64', function (err) {
			if (err) throw err;
			var _staticUrl;
			production
			? _staticUrl = 'http://static.47.76.226.88'
			: _staticUrl = 'http://static.localhost:3000';
			models.Driver.findOneAndUpdate({
				_id: req.body.id
			}, {$set: {
				photo: _staticUrl + '/photos/' + _fileName
			}}, {new: true}, function (err, driver) {
				if (err) throw err;
				res.json(driver);
			});
		});
	});

	app.put('/subdomain/api/drivers/remove-photo', function (req, res) {
		models.Driver.findOneAndUpdate({
			_id: req.body.id
		}, {$set: {
			photo: 'images/user-default.png'
		}}, {new: true}, function (err, driver) {
			if (err) throw err;
			res.json(driver);
		});
	});

	app.put('/subdomain/api/drivers/password', function (req, res) {
		models.Driver.findOne({
			_id: req.body.id
		}, function (err, driver) {
			if (err) throw err;
			password(req.body.password).verifyAgainst(driver.password, function (err, verified) {
				if (err) throw err;
				if (verified) {
					password(req.body.newPassword).hash(function (err, password) {
						if (err) throw err;
						models.Driver.findOneAndUpdate({
							_id: req.body.id
						}, {$set: {
							password: password,
						}}, {new: true}, function (err, driver) {
							if (err) throw err;
							res.json(driver);
						});
					});
				} else {
					res.status(400);
					res.send('Invalid password.');
				};
			});
		});
	});

	app.put('/subdomain/api/drivers/email', function (req, res) {
		models.Driver.findOne({
			email: req.body.email
		}, function (err, driver) {
			if (err) throw err;
			if (driver) {
				res.status(400);
				res.send('Email already taken.');
			} else {
				models.Driver.findOne({
					_id: req.body.id
				}, function (err, driver) {
					if (err) throw err;
					password(req.body.password).verifyAgainst(driver.password, function (err, verified) {
						if (err) throw err;
						if (verified) {
							models.Driver.findOneAndUpdate({
								_id: req.body.id
							}, {$set: {
								email: req.body.email,
							}}, {new: true}, function (err, driver) {
								if (err) throw err;
								res.json(driver);
							});
						} else {
							res.status(400);
							res.send('Invalid password.');
						};
					});
				});
			};
		});
	});

	app.put('/subdomain/api/drivers/car', function (req, res) {
		models.Driver.findOneAndUpdate({
			_id: req.body.id
		}, {$set: {
			car: {
				brand: req.body.brand,
				model: req.body.model,
				licensePlate: req.body.licensePlate,
				year: req.body.year
			}
		}}, {new: true}, function (err, driver) {
			if (err) throw err;
			res.json(driver);
		});
	});

	app.get('/subdomain/api/drivers/:id/travels', function (req, res) {
		models.Travel.find({
			driver: req.params.id,
			showToDriver: true,
			done: true
		})
		.populate('user')
		.populate('code')
			.exec(function (err, travels) {
			if (err) throw err;
			res.json(travels);
		});
	});

	app.delete('/subdomain/api/drivers/travels/:id', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			showToDriver: false
		}}, function (err, travel) {
			if (err) throw err;
			models.Travel.find({
				driver: travel.driver,
				showToDriver: true
			})
			.populate('user')
				.exec(function (err, travels) {
				if (err) throw err;
				res.json(travels);
			});
		});
	});

	app.post('/subdomain/api/drivers/recover-password', function (req, res) {
		models.Driver.findOne({
			email: req.body.email
		}, function (err, driver) {
			if (err) throw err;
			if (driver) {
				if (driver.password) {
					var _randomNumber;
					var _code = (Math.floor(Math.random() * (9 - 1)) + 1).toString();
					for (i = 0; i < 3; i++) {
						_randomNumber = Math.floor(Math.random() * (9 - 1)) + 1;
						_code += _randomNumber.toString();
					};
					emailServer.sendMail({
						text: 'Utilize ' + _code + ' para recuperar a sua senha no Liffy.',
						from: 'Liffy <no-reply@47.76.226.88>',
						to: driver.name + '<' + driver.email + '>',
						subject: 'Seu código Liffy'
					}, function (err, info) {
						if (err) throw err;
						res.json({
							id: driver._id,
							code: _code
						});
					});
				} else {
					res.status(400);
					res.send('Registered as Facebook account.');
				};
			} else {
				res.status(400);
				res.send('Invalid email.');
			};
		});
	});

	app.put('/subdomain/api/drivers/set-new-password', function (req, res) {
		password(req.body.password).hash(function (err, password) {
			if (err) throw err;
			models.Driver.findOneAndUpdate({
				_id: req.body.id
			}, {$set: {
				password: password
			}}, {new: true}, function (err, driver) {
				if (err) throw err;
				res.json(driver);
			});
		});
	});

	app.get('/subdomain/api/drivers/:id', function (req, res) {
		models.Driver.findOne({
			_id: req.params.id
		}, function (err, driver) {
			if (err) throw err;
			res.json(driver);
		});
	});

	app.post('/subdomain/api/drivers/fb-login', function (req, res) {
		models.Driver.findOne({
			email: req.body.email
		}, function (err, driver) {
			if (err) throw err;
			if (driver) {
				if (!driver.active) {
					res.status(400);
					res.send('Driver not active.');
				} else {
					res.json(driver);
				};
			} else {
				res.end();
			};
		});
	});

	app.post('/subdomain/api/drivers/fb-sign', function (req, res) {
		models.Driver.findOne({$or: [{
			cpf: req.body.cpf
		}, {
			phone: req.body.phone
		}]}, function (err, driver) {
			if (err) throw err;
			if (driver) {
				res.status(400);
				if (driver.cpf == req.body.cpf) {
					res.send('CPF already taken.');
				} else {
					res.send('Phone already taken.');
				};
			} else {
				req.body.photo.silhouette
				? _photo = 'images/user-default.png'
				: _photo = req.body.photo.url;
				req.body.email.split('@')[1] === 'facebookmail.47.76.226.88'
				? _hideEmail = true
				: _hideEmail = false;
				models.Driver.create({
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					photo: _photo,
					cpf: req.body.cpf,
					hideEmail: _hideEmail,
					registeredAt: new Date().getTime()
				}, function (err, driver) {
					if (err) throw err;
					res.end();
				});
			};
		});
	});

	app.put('/subdomain/api/drivers/profile', function (req, res) {
		models.Driver.findOne({
			phone: req.body.phone
		}, function (err, driver) {
			if (err) throw err;
			if (driver && driver._id != req.body.id) {
				res.status(400);
				res.send('Phone already taken.');
			} else {
				models.Driver.findOneAndUpdate({
					_id: req.body.id
				}, {$set: {
					name: req.body.name,
					phone: req.body.phone
				}}, {new: true}, function (err, driver) {
					if (err) throw err;
					res.json(driver);
				});
			};
		});
	});

	app.put('/subdomain/api/drivers/request-balance', function (req, res) {
		models.Transaction.create({
			driver: req.body.id,
			amount: req.body.amount,
			madeAt: new Date().getTime()
		}, function (err, transaction) {
			models.Driver.findOneAndUpdate({
				_id: req.body.id
			}, {$inc: {
				balance: -req.body.amount
			}}, {new: true}, function (err, driver) {
				if (err) throw err;
				res.json(driver);
			});
		});
	});
};
