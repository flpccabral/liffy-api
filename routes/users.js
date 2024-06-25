module.exports = function (app, models, password, fs, emailServer, production) {
	app.post('/subdomain/api/users', function (req, res) {
		models.User.findOne({$or: [{
			email: req.body.email
		}, {
			phone: req.body.phone
		}]}, function (err, user) {
			if (err) throw err;
			if (user) {
				res.status(400);
				user.email === req.body.email
				? res.send('Email already taken.')
				: res.send('Phone already taken.');
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
					models.User.create({
						name: capitalizeName(req.body.name),
						email: req.body.email,
						phone: req.body.phone,
						password: password,
						photo: 'images/user-default.png',
						registeredAt: new Date().getTime()
					}, function (err, user) {
						if (err) throw err;
						res.json(user);
					});
				});
			};
		});
	});

	app.post('/subdomain/api/users/login', function (req, res) {
		models.User.findOne({
			email: req.body.email
		}, function (err, user) {
			if (err) throw err;
			if (user) {
				password(req.body.password).verifyAgainst(user.password, function (err, verified) {
					if (err) throw err;
					if (verified) {
						if (user.blocked) {
							res.status(400);
							res.send('User blocked.');
						} else {
							res.json(user);
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

	app.put('/subdomain/api/users/photo', function (req, res) {
		var _fileName = req.body.id + new Date().getTime() + '.png';
		fs.writeFile('static/photos/' + _fileName, req.body.photo, 'base64', function (err) {
			if (err) throw err;
			var _staticUrl;
			production
			? _staticUrl = 'http://47.76.226.88'
			: _staticUrl = 'http://static.localhost:3000';
			models.User.findOneAndUpdate({
				_id: req.body.id
			}, {$set: {
				photo: _staticUrl + '/photos/' + _fileName
			}}, {new: true}, function (err, user) {
				if (err) throw err;
				res.json(user);
			});
		});
	});

	app.put('/subdomain/api/users/remove-photo', function (req, res) {
		models.User.findOneAndUpdate({
			_id: req.body.id
		}, {$set: {
			photo: 'images/user-default.png'
		}}, {new: true}, function (err, user) {
			if (err) throw err;
			res.json(user);
		});
	});

	app.put('/subdomain/api/users/password', function (req, res) {
		models.User.findOne({
			_id: req.body.id
		}, function (err, user) {
			if (err) throw err;
			password(req.body.password).verifyAgainst(user.password, function (err, verified) {
				if (err) throw err;
				if (verified) {
					password(req.body.newPassword).hash(function (err, password) {
						if (err) throw err;
						models.User.findOneAndUpdate({
							_id: req.body.id
						}, {$set: {
							password: password,
						}}, {new: true}, function (err, user) {
							if (err) throw err;
							res.json(user);
						});
					});
				} else {
					res.status(400);
					res.send('Invalid password.');
				};
			});
		});
	});

	app.put('/subdomain/api/users/email', function (req, res) {
		models.User.findOne({
			email: req.body.email
		}, function (err, user) {
			if (err) throw err;
			if (user) {
				res.status(400);
				res.send('Email already taken.');
			} else {
				models.User.findOne({
					_id: req.body.id
				}, function (err, user) {
					if (err) throw err;
					password(req.body.password).verifyAgainst(user.password, function (err, verified) {
						if (err) throw err;
						if (verified) {
							models.User.findOneAndUpdate({
								_id: req.body.id
							}, {$set: {
								email: req.body.email,
							}}, {new: true}, function (err, user) {
								if (err) throw err;
								res.json(user);
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

	app.get('/subdomain/api/users/:id/travels', function (req, res) {
		models.Travel.find({
			user: req.params.id,
			showToUser: true,
			done: true
		})
		.populate('driver')
		.populate('code')
			.exec(function (err, travels) {
			if (err) throw err;
			res.json(travels);
		});
	});

	app.delete('/subdomain/api/users/travels/:id', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			showToUser: false
		}}, function (err, travel) {
			if (err) throw err;
			models.Travel.find({
				user: travel.user,
				showToUser: true,
				done: true
			})
			.populate('driver')
				.exec(function (err, travels) {
				if (err) throw err;
				res.json(travels);
			});
		});
	});

	app.post('/subdomain/api/users/recover-password', function (req, res) {
		models.User.findOne({
			email: req.body.email
		}, function (err, user) {
			if (err) throw err;
			if (user) {
				if (user.password) {
					var _randomNumber;
					var _code = (Math.floor(Math.random() * (9 - 1)) + 1).toString();
					for (i = 0; i < 3; i++) {
						_randomNumber = Math.floor(Math.random() * (9 - 1)) + 1;
						_code += _randomNumber.toString(); 
					};
					emailServer.sendMail({
						text: 'Utilize ' + _code + ' para recuperar a sua senha no Liffy.',
						from: 'Liffy <no-reply@liffy.com.br>',
						to: user.name + '<' + user.email + '>',
						subject: 'Seu código Liffy'
					}, function (err, info) {
						if (err) throw err;
						res.json({
							id: user._id,
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

	app.put('/subdomain/api/users/set-new-password', function (req, res) {
		password(req.body.password).hash(function (err, password) {
			if (err) throw err;
			models.User.findOneAndUpdate({
				_id: req.body.id
			}, {$set: {
				password: password
			}}, {new: true}, function (err, user) {
				if (err) throw err;
				res.json(user);
			});
		});
	});

	app.get('/subdomain/api/users/:id', function (req, res) {
		models.User.findOne({
			_id: req.params.id
		}, function (err, user) {
			if (err) throw err;
			res.json(user);
		});
	});

	app.post('/subdomain/api/users/fb-login', function (req, res) {
		models.User.findOne({
			email: req.body.email
		}, function (err, user) {
			if (err) throw err;
			if (user) {
				if (user.blocked) {
					res.status(400);
					res.send('User blocked.');
				} else {
					res.json(user);
				};
			} else {
				res.end();
			};
		});
	});

	app.post('/subdomain/api/users/fb-sign', function (req, res) {
		models.User.findOne({
			phone: req.body.phone
		}, function (err, user) {
			if (err) throw err;
			if (user) {
				res.status(400);
				res.send('Phone already taken.');
			} else {
				req.body.photo.silhouette
				? _photo = 'images/user-default.png'
				: _photo = req.body.photo.url;
				req.body.email.split('@')[1] === 'facebookmail.liffy.com.br'
				? _hideEmail = true
				: _hideEmail = false;
				models.User.create({
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					photo: _photo,
					hideEmail: _hideEmail,
					registeredAt: new Date().getTime()
				}, function (err, user) {
					if (err) throw err;
					res.json(user);
				});
			};
		});
	});

	app.put('/subdomain/api/users/profile', function (req, res) {
		models.User.findOne({
			phone: req.body.phone
		}, function (err, user) {
			if (err) throw err;
			if (user && user._id != req.body.id) {
				res.status(400);
				res.send('Phone already taken.');
			} else {
				models.User.findOneAndUpdate({
					_id: req.body.id
				}, {$set: {
					name: req.body.name,
					phone: req.body.phone
				}}, {new: true}, function (err, user) {
					if (err) throw err;
					res.json(user);
				});
			};
		});
	});
};