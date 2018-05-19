var mongoose = require('mongoose');
var config = require('./');

module.exports = () => {

	mongoose.Promise = global.Promise;

	mongoose.connect(
		config.mongodb, 
		{
			useMongoClient: true
		}
	);
}