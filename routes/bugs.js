module.exports = function (app, models) {
	app.post('/subdomain/api/bugs', async function (req, res) {
		try {
			await models.Bug.create({
				info: req.body.info,
				sentAt: new Date().getTime()
			});
			res.end();
		} catch (err) {
			throw err;
		}
	});
};