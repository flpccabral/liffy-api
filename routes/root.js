module.exports = function (app, models, emailServer, production) {

	require('./root/drivers')(app, models);
	require('./root/users')(app, models);
	require('./root/bugs')(app, models);
	require('./root/promotionalCodes')(app, models);

	app.post('/subdomain/root/login', function (req, res) {
		var _code = (new Date().getDate() * 25).toString() + (new Date().getDate() * 12).toString();
		if (req.body.code === _code) {
			res.end();
		} else {
			res.status(400);
			res.send('Invalid code.');
		};
	});

	app.post('/subdomain/root/request-code', async function (req, res) {
		var _to;
		production
		? _to = 'Etiene <felipeccabral2011@gmail.com>'
		: _to = 'Hélio <felipeccabral2011@gmail.com>';
		var _code = (new Date().getDate() * 25).toString() + (new Date().getDate() * 12).toString();

		try {
			await sendMailPromise({
				text: 'Utilize o código ' + _code + ' para obter acesso ao Liffy Admin.',
				from: 'Liffy <no-reply@47.76.226.88>',
				to: _to,
				subject: 'Código para acesso ao painel'
			});
			res.end();
		} catch (err) {
			throw err;
		}
	});

	function sendMailPromise(mailOptions) {
		return new Promise(function (resolve, reject) {
			emailServer.sendMail(mailOptions, function (err, info) {
				if (err) {
					reject(err);
				} else {
					resolve(info);
				}
			});
		});
	}
};