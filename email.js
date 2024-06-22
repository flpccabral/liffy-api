const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'no-reply@47.76.226.88',
		pass: 'prime1991'
	}
});