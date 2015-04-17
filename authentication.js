//Getting required modules 
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var redis        = require("redis")
var redis_client = redis.createClient()
redis_client.on("error", function (err) {
    console.log("Error " + err)
});
var RedisStore   = require('connect-redis')(session)
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash')
var methodOverride = require('method-override')
var multer = require('multer')

var User = require("./ressources/users.js")

module.exports = function(app){
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(session({ 
    	secret: "beacoup2s3l",
	    store: new RedisStore({
	        client: redis_client,
	        prefix: "desk_sess"
	    }),
	    resave:true,
	    saveUninitialized: true
	}))
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(multer());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash())
	app.set('json spaces', 2)

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
    	var options = {
    		root: __dirname + '/web/',
    		dotfiles: 'deny',
    		headers: {
		        'x-timestamp': Date.now(),
		        'x-sent': true
		    }
    	}
    	res.sendFile("login.html", options, function(err){
    		if(err){
    			console.log(err)
    			res.status(500).send('An error has occured')
    		}
    	})
    })
    app.get('/logout', function(req, res){
    	req.logout()
    	res.redirect("/")
    })
}