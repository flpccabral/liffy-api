module.exports = function (app, models, password, fs, emailServer, production) {
	app.post('/subdomain/api/users', async function (req, res) {
		try {
			const user = await models.User.findOne({$or: [{email: req.body.email}, {phone: req.body.phone}]});
			if (user) {
				res.status(400);
				user.email === req.body.email ? res.send('Email already taken.') : res.send('Phone already taken.');
			} else {
				password(req.body.password).hash(async function (err, password) {
					if (err) throw err;
					const newUser = await models.User.create({
						name: capitalizeName(req.body.name),
						email: req.body.email,
						phone: req.body.phone,
						password: password,
						photo: 'images/user-default.png',
						registeredAt: new Date().getTime()
					});
					res.json(newUser);
				});
			}
		} catch (err) {
			throw err;
		}
	});

	app.post('/subdomain/api/users/login', async function (req, res) {
		try {
			const user = await models.User.findOne({ email: req.body.email });
			if (user) {
				const verified = await new Promise((resolve, reject) => {
					password(req.body.password).verifyAgainst(user.password, function (err, verified) {
						if (err) reject(err);
						resolve(verified);
					});
				});
				if (verified) {
					if (user.blocked) {
						res.status(400);
						res.send('User blocked.');
					} else {
						res.json(user);
					}
				} else {
					res.status(400);
					res.send('Invalid login.');
				}
			} else {
				res.status(400);
				res.send('Invalid login.');
			}
		} catch (err) {
			throw err;
		}
	});

	app.put('/subdomain/api/users/photo', function (req, res) {
		var _fileName = req.body.id + new Date().getTime() + '.png';
		new Promise((resolve, reject) => {
			fs.writeFile('static/photos/' + _fileName, req.body.photo, 'base64', function (err) {
				if (err) reject(err);
				resolve();
			});
		})
		.then(() => {
			var _staticUrl;
			production
			? _staticUrl = 'http://47.76.226.88'
			: _staticUrl = 'http://static.localhost:3000';
			return new Promise((resolve, reject) => {
				models.User.findOneAndUpdate({
					_id: req.body.id
				}, {$set: {
					photo: _staticUrl + '/photos/' + _fileName
				}}, {new: true}, function (err, user) {
					if (err) reject(err);
					resolve(user);
				});
			});
		})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			throw err;
		});
	});

	app.put('/subdomain/api/users/remove-photo', function (req, res) {
		new Promise((resolve, reject) => {
			models.User.findOneAndUpdate(
				{
					_id: req.body.id
				},
				{
					$set: {
						photo: 'images/user-default.png'
					}
				},
				{ new: true },
				function (err, user) {
					if (err) reject(err);
					resolve(user);
				}
			);
		})
			.then((user) => {
				res.json(user);
			})
			.catch((err) => {
				throw err;
			});
	});

	app.put('/subdomain/api/users/password', function (req, res) {
		models.User.findOne({
			_id: req.body.id
		})
		.then((user) => {
			return new Promise((resolve, reject) => {
				password(req.body.password).verifyAgainst(user.password, function (err, verified) {
					if (err) reject(err);
					if (verified) {
						resolve(user);
					} else {
						res.status(400);
						res.send('Invalid password.');
					}
				});
			});
		})
		.then((user) => {
			return new Promise((resolve, reject) => {
				password(req.body.newPassword).hash(function (err, password) {
					if (err) reject(err);
					resolve({ user, password });
				});
			});
		})
		.then(({ user, password }) => {
			return new Promise((resolve, reject) => {
				models.User.findOneAndUpdate({
					_id: req.body.id
				}, {$set: {
					password: password,
				}}, {new: true}, function (err, user) {
					if (err) reject(err);
					resolve(user);
				});
			});
		})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			throw err;
		});
	});

	app.put('/subdomain/api/users/email', function (req, res) {
		models.User.findOne({
			email: req.body.email
		})
		.then((user) => {
			if (user) {
				res.status(400);
				res.send('Email already taken.');
			} else {
				return models.User.findOne({
					_id: req.body.id
				});
			}
		})
		.then((user) => {
			return new Promise((resolve, reject) => {
				password(req.body.password).verifyAgainst(user.password, function (err, verified) {
					if (err) reject(err);
					if (verified) {
						resolve(user);
					} else {
						res.status(400);
						res.send('Invalid password.');
					}
				});
			});
		})
		.then((user) => {
			return new Promise((resolve, reject) => {
				models.User.findOneAndUpdate({
					_id: req.body.id
				}, {$set: {
					email: req.body.email,
				}}, {new: true}, function (err, user) {
					if (err) reject(err);
					resolve(user);
				});
			});
		})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			throw err;
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
			.exec()
			.then((travels) => {
				res.json(travels);
			})
			.catch((err) => {
				throw err;
			});
	});

	app.delete('/subdomain/api/users/travels/:id', function (req, res) {
		models.Travel.findOneAndUpdate({
			_id: req.params.id
		}, {$set: {
			showToUser: false
		}})
		.then((travel) => {
			return models.Travel.find({
				user: travel.user,
				showToUser: true,
				done: true
			})
			.populate('driver')
			.exec();
		})
		.then((travels) => {
			res.json(travels);
		})
		.catch((err) => {
			throw err;
		});
	});

	app.post('/subdomain/api/users/recover-password', function (req, res) {
		models.User.findOne({
			email: req.body.email
		})
		.then((user) => {
			if (user) {
				if (user.password) {
					var _randomNumber;
					var _code = (Math.floor(Math.random() * (9 - 1)) + 1).toString();
					for (i = 0; i < 3; i++) {
						_randomNumber = Math.floor(Math.random() * (9 - 1)) + 1;
						_code += _randomNumber.toString(); 
					};
					return new Promise((resolve, reject) => {
						emailServer.sendMail({
							text: 'Utilize ' + _code + ' para recuperar a sua senha no Liffy.',
							from: 'Liffy <no-reply@liffy.com.br>',
							to: user.name + '<' + user.email + '>',
							subject: 'Seu código Liffy'
						}, function (err, info) {
							if (err) reject(err);
							resolve({
								id: user._id,
								code: _code
							});
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
		})
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			throw err;
		});
	});

	app.put('/subdomain/api/users/set-new-password', async function (req, res) {
		try {
			const passwordHash = await new Promise((resolve, reject) => {
				password(req.body.password).hash(function (err, password) {
					if (err) reject(err);
					resolve(password);
				});
			});
			const updatedUser = await models.User.findOneAndUpdate(
				{
					_id: req.body.id
				},
				{
					$set: {
						password: passwordHash
					}
				},
				{ new: true }
			);
			res.json(updatedUser);
		} catch (err) {
			throw err;
		}
	});

	app.get('/subdomain/api/users/:id', function (req, res) {
		models.User.findOne({
			_id: req.params.id
		})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			throw err;
		});
	});

	app.post('/subdomain/api/users/fb-login', async function (req, res) {
		try {
			const user = await models.User.findOne({ email: req.body.email });
			if (user) {
				if (user.blocked) {
					res.status(400);
					res.send('User blocked.');
				} else {
					res.json(user);
				}
			} else {
				res.end();
			}
		} catch (err) {
			throw err;
		}
	});

	app.post('/subdomain/api/users/fb-sign', function (req, res) {
		models.User.findOne({
			phone: req.body.phone
		})
		.then((user) => {
			if (user) {
				res.status(400);
				res.send('Phone already taken.');
			} else {
				let _photo;
				let _hideEmail;
				if (req.body.photo.silhouette) {
					_photo = 'images/user-default.png';
				} else {
					_photo = req.body.photo.url;
				}
				if (req.body.email.split('@')[1] === 'facebookmail.liffy.com.br') {
					_hideEmail = true;
				} else {
					_hideEmail = false;
				}
				return models.User.create({
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					photo: _photo,
					hideEmail: _hideEmail,
					registeredAt: new Date().getTime()
				});
			}
		})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			throw err;
		});
	});

	app.put('/subdomain/api/users/profile', function (req, res) {
		models.User.findOne({
			phone: req.body.phone
		})
			.then((user) => {
				if (user && user._id != req.body.id) {
					res.status(400);
					res.send('Phone already taken.');
				} else {
					return models.User.findOneAndUpdate({
						_id: req.body.id
					}, {
						$set: {
							name: req.body.name,
							phone: req.body.phone
						}
					}, { new: true });
				}
			})
			.then((user) => {
				res.json(user);
			})
			.catch((err) => {
				throw err;
			});
	});
};