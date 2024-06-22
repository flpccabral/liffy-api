const password = require('password-hash-and-salt');
const fs = require('fs');
const subdomain = require('express-subdomain-handler');

module.exports = function (app, models, express, emailServer, production) {

	production
	? app.use(subdomain({
		baseUrl: '47.76.226.88',
		prefix: 'subdomain'
	}))
	: app.use(subdomain({
		baseUrl: 'localhost',
		prefix: 'subdomain',
		logger: true
	}));

	app.use('/subdomain/admin', express.static(production
	? 'admin'
	: 'admin-source'
	));
	app.use('/subdomain/static', express.static('static'));
	app.use('/subdomain/api', express.static('static'));

	require('./routes/users')(app, models, password, fs, emailServer, production);
	require('./routes/drivers')(app, models, password, fs, emailServer, production);
	require('./routes/bugs')(app, models);
	require('./routes/travels')(app, models, production);
	require('./routes/root')(app, models, emailServer, production);

	app.get('/terms', function (req, res) {
		res.sendFile(__dirname + '/static/documents/terms.pdf');
	});
};
