const router = require('express').Router();
const passport = require('passport');
const Users = require('../models/Users');
const {ensureAuthenticated, forwardAuthenticated} = require('../helpers/authHelper');

router.get('/logout', ensureAuthenticated, (req, res) => {	//TODO add routing guards
	req.logOut();
	res.send('logged out');
});

router.get('/login', forwardAuthenticated, (req, res) => {	//TODO add routing guards
	res.send('Login');
});

router.post('/login', forwardAuthenticated, passport.authenticate('local', 	//TODO add routing guards
	{
		successRedirect : '/users/edit',
		failureRedirect : '/users/login'
	}
));

router.get('/signup', forwardAuthenticated, (req, res) => {	//TODO add routing guards
	res.send('Sign up page');
});

router.post('/signup', forwardAuthenticated, (req, res) => {	//TODO add routing guards and validation
	// check the req body
	// console.log(req.body);
	// const newUser = new Users(req.body);
	// newUser.save( (err, user) => {
	// 	if(err){
	// 		console.log(err);
	// 		res.send('Couldn\'t save user');}
	// 	else {
	// 		res.send(user.username + ' was saved');	
	// 	}
	// });
	const user = new Users({
		'username' : req.body.username
	});
	user._password = req.body.password;
	Users.create(user)
		.then( __user => {
			res.send(__user.username + ' was saved');
		})
		.catch( err => {
			console.log(err);
			res.send('Couldn\'t save user');
		});
});

router.get('/edit', ensureAuthenticated, (req, res) => {	//TODO add routing guards
	res.send('User : '+(req.user ? req.user.username : null));
});

// router.put("/edit", (req, res, next) => {	//TODO add routing guards
// 	res.redirect("/edit")
// })

// router.get("/:username", (req, res, next) => {	//TODO add routing guards
// 	res.send(`Details of user : ${req.params.username}`)
// })

module.exports = router;