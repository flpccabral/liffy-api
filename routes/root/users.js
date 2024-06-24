module.exports = function (app, models) {
	app.get('/subdomain/root/users', function (req, res) {
		models.User.find()
			.then(users => {
				res.json(users);
			})
			.catch(err => {
				throw err;
			});
	});

	app.get('/subdomain/root/users/:id', function (req, res) {
		models.User.findOne({
			_id: req.params.id
		})
			.then(user => {
				res.json(user);
			})
			.catch(err => {
				throw err;
			});
	});

	app.put('/subdomain/root/users/:id', function (req, res) {
		models.User.findOneAndUpdate({
			_id: req.params.id	
		}, {$set: {
			blocked: req.body.blocked,
			email: req.body.email,
			phone: req.body.phone
		}})
			.then(() => {
				res.end();
			})
			.catch(err => {
				throw err;
			});
	});

	app.delete('/subdomain/root/users/:id', function (req, res) {
		models.User.remove({
			user: req.params.id
		})
			.then(() => {
				return models.User.remove({
					_id: req.params.id
				});
			})
			.then(() => {
				return models.User.find();
			})
			.then(users => {
				res.json(users);
			})
			.catch(err => {
				throw err;
			});
	});
};