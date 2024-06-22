const mongoose = require('mongoose');

module.exports = mongoose.model('Message', {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	driver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Driver'
	},
	travel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Travel'
	},
	content: String
});