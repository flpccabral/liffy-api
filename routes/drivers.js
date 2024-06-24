module.exports = function (app, models, password, fs, emailServer, production) {
	app.post('/subdomain/api/drivers', async function (req, res) {
		try {
			const driver = await models.Driver.findOne({$or: [{
				email: req.body.email
			}, {
				phone: req.body.phone
			}, {
				cpf: req.body.cpf
			}]});
			
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
				const hashedPassword = await new Promise((resolve, reject) => {
					password(req.body.password).hash((err, password) => {
						if (err) reject(err);
						resolve(password);
					});
				});
				
				function capitalizeName (name) {
					return name
						.toLowerCase()
						.split(' ')
						.map((word) => {
							return word[0].toUpperCase() + word.substr(1);
						})
						.join(' ')
				};
				
				const driver = await models.Driver.create({
					name: capitalizeName(req.body.name),
					email: req.body.email,
					phone: req.body.phone,
					password: hashedPassword,
					photo: 'images/user-default.png',
					cpf: req.body.cpf,
					registeredAt: new Date().getTime()
				});
				
				res.end();
			};
		} catch (err) {
			throw err;
		}
	});

	app.post('/subdomain/api/drivers/login', async function (req, res) {
		try {
			const driver = await models.Driver.findOne({
				email: req.body.email
			});
			
			if (driver) {
				const verified = await new Promise((resolve, reject) => {
					password(req.body.password).verifyAgainst(driver.password, (err, verified) => {
						if (err) reject(err);
						resolve(verified);
					});
				});
				
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
			} else {
				res.status(400);
				res.send('Invalid login.');
			};
		} catch (err) {
			throw err;
		}
	});

	app.put('/subdomain/api/drivers/photo', async function (req, res) {
		try {
			const _fileName = req.body.id + new Date().getTime() + '.png';
			
			await new Promise((resolve, reject) => {
				fs.writeFile('static/photos/' + _fileName, req.body.photo, 'base64', (err) => {
					if (err) reject(err);
					resolve();
				});
			});
			
			let _staticUrl;
			production
			? _staticUrl = 'http://47.76.226.88'
			: _staticUrl = 'http://static.localhost:3000';
			
			const driver = await models.Driver.findOneAndUpdate({
				_id: req.body.id
			}, {$set: {
				photo: _staticUrl + '/photos/' + _fileName
			}}, {new: true});
			
			res.json(driver);
		} catch (err) {
			throw err;
		}
	});

	// Rest of the code...
};
