const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://flpcc:Mfmi270154@cluster0.jvghlrx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

module.exports = {
	User: require('./models/User'),
	Bug: require('./models/Bug'),
	Travel: require('./models/Travel'),
	Driver: require('./models/Driver'),
	Message: require('./models/Message'),
	PromotionalCode: require('./models/PromotionalCode')
};
