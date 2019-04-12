const LocalStrategy = require("passport-local")
const User = require('../models/Users')

const localStrategy = new LocalStrategy(
    {
        'usernameField' : 'username',
        'passwordField' : 'password'
    },
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
        })
    }
)