const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	name: String,
	email: String,
	phone: String,
	password: String,
	photo: String,
	hideEmail: Boolean,
	registeredAt: Number,
	blocked: {
		type: Boolean,
		default: false
	}
});