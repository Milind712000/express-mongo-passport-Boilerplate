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

// this callback funtion inherits (this)
// thus it cannot be defined using arrow functions.
// I don't completely understand the reason
// but from now on I think its better to not use
// arrow function when (this) object is involved
user.pre('save', function (next) {
	console.log(this);
	next();
});

// TODO add pre save hook to hash passwords

const User = mongoose.model('User', user);

module.exports = User;