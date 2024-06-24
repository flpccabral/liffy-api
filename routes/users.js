module.exports = function (app, models, password, fs, emailServer, production) {
	app.post('/subdomain/api/users', function (req, res) {
		models.User.findOne({$or: [{
			email: req.body.email
		}, {
			phone: req.body.phone
		}]})
		.then(user => {
			if (user) {
				res.status(400);
				user.email === req.body.email
				? res.send('Email already taken.')
				: res.send('Phone already taken.');
			} else {
				password(req.body.password).hash()
				.then(password => {
					function capitalizeName (name) {
						return name
							.toLowerCase()
							.split(' ')
							.map(word => {
								return word[0].toUpperCase() + word.substr(1);
							})
							.join(' ')
					};
					return models.User.create({
						name: capitalizeName(req.body.name),
						email: req.body.email,
						phone: req.body.phone,
						password: password,
						photo: 'images/user-default.png',
						registeredAt: new Date().getTime()
					});
				})
				.then(user => {
					res.json(user);
				})
				.catch(err => {
					throw err;
				});
			};
		})
		.catch(err => {
			throw err;
		});
	});

	app.post('/subdomain/api/users/login', function (req, res) {
		models.User.findOne({
			email: req.body.email
		})
		.then(user => {
			if (user) {
				return password(req.body.password).verifyAgainst(user.password);
			} else {
				res.status(400);
				res.send('Invalid login.');
			}
		})
		.then(verified => {
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
		})
		.catch(err => {
			throw err;
		});
	});

	app.put('/subdomain/api/users/photo', function (req, res) {
		var _fileName = req.body.id + new Date().getTime() + '.png';
		fs.writeFile('static/photos/' + _fileName, req.body.photo, 'base64')
		.then(() => {
			var _staticUrl;
			production
			? _staticUrl = 'http://47.76.226.88'
			: _staticUrl = 'http://static.localhost:3000';
			return models.User.findOneAndUpdate({
				_id: req.body.id
			}, {$set: {
				photo: _staticUrl + '/photos/' + _fileName
			}}, {new: true});
		})
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			throw err;
		});
	});

	// Rest of the code...
};
