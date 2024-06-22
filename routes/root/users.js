module.exports = function (app, models) {
	app.get('/subdomain/root/users', function (req, res) {
		models.User.find(function (err, users) {
			if (err) throw err;
			res.json(users);
		});
	});

	app.get('/subdomain/root/users/:id', function (req, res) {
		models.User.findOne({
			_id: req.params.id
		}, function (err, user) {
			if (err) throw err;
			res.json(user);
		});
	});

	app.put('/subdomain/root/users/:id', function (req, res) {
		models.User.findOneAndUpdate({
			_id: req.params.id	
		}, {$set: {
			blocked: req.body.blocked,
			email: req.body.email,
			phone: req.body.phone
		}}, function (err) {
			if (err) throw err;
			res.end();
		});
	});

	app.delete('/subdomain/root/users/:id', function (req, res) {
		models.User.remove({
			user: req.params.id
		}, function (err) {
			if (err) throw err;
			models.User.remove({
				_id: req.params.id
			}, function (err) {
				if (err) throw err;
				models.User.find(function (err, users) {
					if (err) throw err;
					res.json(users);
				});
			});
		});
	});
};