const mongoose = require('mongoose');

module.exports = mongoose.model('Driver', {
	name: String,
	email: String,
	phone: String,
	password: String,
	photo: String,
	cpf: String,
	car: Object,
	active: {
		type: Boolean,
		default: false
	},
	type: String,
	hideEmail: Boolean,
	registeredAt: Number,
	balance: {
		type: Number,
		default: 0
	}
});