// module imports
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');

// router imports
const index = require('./routes/index');
const users = require('./routes/users');

// model imports
const Users = require('./models/Users');

// other imports
const dbConfig = require('./config/dbKeys-local');

const app = express();

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.URI, {
	useNewUrlParser: true
});
const db = mongoose.connection;

db.once('open', () => {
	console.log('MongoDB connected');
});

db.once('error', (err) => {
	console.log('Error connecting to Database');
	console.log(err.message);
});

// setup template engine
app.set('views', path.join(__dirname, 'views')); //by default the 'views' folder is used so this line is not actually required
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile); // this line configures node to use ejs engine for files with html extension

// log all requests
app.use(morgan('tiny'));

// express body-parser
app.use(express.json({
	limit: '30MB',
	extended: true
}));
app.use(express.urlencoded({
	limit: '30MB',
	extended: true
}));

// assign sessions to users
app.use(session({
	'secret': 'aye-tatti',
	'resave': true,
	'saveUninitialized': true
}));

// passport config
passport.use(new passportLocal.Strategy(
	{
		'usernameField': 'username',
		'passwordField': 'password'
	},
	async (username, password, done) => {
		// Users.findOne({username : username})
		// .then(user => {
		// 	if (!user) {
		// 		console.log("User not found");
		// 		done(null, false)				
		// 	} else if(! user.password === password ){
		// 		console.log("Incorrect Password");
		// 		done(null, false)
		// 	} else {
		// 		done(null, user)
		// 	}
		// })
		// .catch( (err) => {
		// 	done(err)
		// })
		// let user = null
		try {
			const user = await Users.findOne({username : username});	// TODO add better error handler instead of try except
			if(!user) {
				console.log('User not found');
				done(null, false);
			} else if(!user.checkPassword(password)) {
				console.log('wrong password');
				done(null, false);
			} else {
				done(null, user);
			}
		} catch (error) {
			done(error);
		}
	}
));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser( (user, done) => {
	done(null, user.username);
});
passport.deserializeUser( (username, done) => {
	Users.findOne( {username : username})	// TODO add better error handling with promise support
		.then( user => {
			done(null, user);
		})
		.catch( err => {
			done(err);
		});
});

// Log the user
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	console.log('USER : ', res.locals.user);
	next();
});

// routes
app.use('/', index);
app.use('/users', users);

// for invalid paths
app.use((req, res) => {
	res.send('Page not found');
});

// error handling
app.use((err, req, res, next) => {
	if (res.headersSent) next(err);
	console.log(err.message);
	res.send('Something Broke !!');
});

//listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started listening on PORT : ${PORT}`);
});