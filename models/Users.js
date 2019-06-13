const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const user = new schema({
	username : {
		type : String,
		required : true
	},
	hashedPassword : {
		type : String,
		required : true
	},
	DOC : {					// Date of Creation
		type : Date,
		default : Date.now()
	}
});

user.methods.checkPassword = function(password) {
	try {
		if ( bcrypt.compareSync(password, this.hashedPassword) ) return true;
		else return false;
	} catch (error) {
		console.log(error.message);
	}
};

// TODO virtuals setter for password which hashes the password before storing

// this callback funtion inherits (this)
// thus it cannot be defined using arrow functions.
// I don't completely understand the reason
// but from now on I think its better to not use
// arrow function when (this) object is involved
user.pre('save', function (next) {
	console.log(this);
	next();
});

// user.pre('toJSON', function (next) {
// 	const user = this;
// 	delete user.password;
// });

// TODO add pre save hook to hash passwords
user.virtual('_password').set(function (password) {
	const salt = bcrypt.genSaltSync(saltRounds);
	this.hashedPassword = bcrypt.hashSync(password, salt);
});


const User = mongoose.model('User', user);

module.exports = User;

// mongoose (document/schema/model whatever) events that I've started using
// save
// there are others like
// update
// toObject