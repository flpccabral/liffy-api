const mongoose = require('mongoose');

module.exports = mongoose.model('Travel', {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	driver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Driver'
	},
	observation: String,
	origin: Object,
	destination: Object,
	distance: Number,
	done: Boolean,
	date: Number,
	type: String,
	paymentMethod: String,
	showToUser: {
		type: Boolean,
		default: true
	},
	showToDriver: {
		type: Boolean,
		default: true
	},
	rate: Object,
	elapsedTime: Number,
	started: Boolean,
	code: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PromotionalCode'
	}
});