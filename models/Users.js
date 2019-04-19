const mongoose = require('mongoose');
const schema = mongoose.Schema;

const user = new schema({
	username : {
		type : String,
		required : true
	},
	password : {
		type : String,
		required : true
	},
	DOC : {					// Date of Creation
		type : Date,
		default : Date.now()
	}
});

user.methods.checkPassword = function(password) {
	if(this.password === password) return true;
	else return false;
};

// TODO add pre save hook to hash passwords

const User = mongoose.model('User', user);

module.exports = User;