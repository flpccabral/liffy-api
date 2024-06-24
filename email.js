const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'felipeccabral2011@gmail.com',
		pass: 'lpza qpiz ayef pqkh'
	}
});