var session = require('express-session')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var multer = require('multer')
var flash = require('connect-flash')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var User = require("./ressources/users.js")

module.exports = function(app){
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(multer());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash())

	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
				  	return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	));
	passport.serializeUser(function(user, done) {
	  	done(null, user.username);
	});

	passport.deserializeUser(function(username, done) {
	  	User.findOne({username: username}, function(err, user) {
	    	done(err, user);
	  	});
	});

    app.post('/login',
		passport.authenticate('local', { successRedirect: '/',
		                                   failureRedirect: '/login',
		                                   failureFlash: true })
	);
    app.get('/login', function(req, res){
    	res.send("login")
    })
}
