const mongoose = require('mongoose');

module.exports = mongoose.model('PromotionalCode', {
	discount: Number,
    code: String,
    used: {
		type: Boolean,
		default: false
	},
    createdAt: Number
});