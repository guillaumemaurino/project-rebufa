const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const c2c = require('./routes/c2c');
const algolia = require('./routes/algolia');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const configDB = require('./config/database.js');
const port     = process.env.PORT || 8080;

// Connect to mongoDB
mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;
// Setting debug to true
mongoose.set('debug', false);
console.log("Mongoose debug mode disabled.")

// Pass passport for configuration
require('./config/passport')(passport);

// Set-up express app
const app = express();
// Set up controler
app.set('view engine', 'ejs');

// set up our express application
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// first midelware
app.use(express.static('./public'));
// use the body parser before the routes
app.use(bodyParser.json());
// Initialize the routes that are setup in api;
app.use('/api',require('./routes/api'));
// 3rd midelware is the error handling
app.use(function(err, req, res, next){
	//console.log(err);
	res.status(422).send({
		error : err.message
	});
});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Listen for request
app.listen(port, function(){
	console.log('Now listening for requests on port ' + port);

    // Launch c2c initialization functions.
    // c2c.c2c_init_latest_outing();

    // Launch algolia initialization functions.
    // algolia.algolia_init();
		// algolia.algolia_setting();
});
