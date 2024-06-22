const mongoose = require('mongoose');

module.exports = mongoose.model('Bug', {
	info: String,
	sentAt: Number
});