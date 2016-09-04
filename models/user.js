var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/simplenodeauth');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	profilephoto: {
		type: String
	}
	
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
	newUser.save(callback);
}