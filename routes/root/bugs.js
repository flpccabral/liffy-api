module.exports = function (app, models) {
	app.get('/subdomain/root/bugs', function (req, res) {
		models.Bug.find()
			.then(function (bugs) {
				res.json(bugs);
			})
			.catch(function (err) {
				throw err;
			});
	});

	app.delete('/subdomain/root/bugs/:id', function (req, res) {
		models.Bug.remove({
			_id: req.params.id
		})
			.then(function () {
				return models.Bug.find();
			})
			.then(function (bugs) {
				res.json(bugs);
			})
			.catch(function (err) {
				throw err;
			});
	});
};