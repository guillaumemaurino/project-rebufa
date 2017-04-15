const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const c2c = require('./routes/c2c');
const algolia = require('./routes/algolia');

// Set-up express app
const app = express();
// Set up controler
app.set('view engine', 'ejs');

// first midelware
app.use(express.static('./public'));

// Connect to mongoDB
mongoose.connect('mongodb://localhost/ninjago');
mongoose.Promise = global.Promise;

// Setting debug to true
mongoose.set('debug', false);
console.log("Mongoose debug mode disabled.")

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

app.get('/', function(req, res){
	res.render('home');
});

app.get('/map', function(req, res){
	res.render('map');
});

app.get('/routes', function(req, res){
	res.render('routes', {search: req.query.search});
});

app.get('/test_style', function(req, res){
	res.render('test_style');
});

// Listen for request
app.listen(process.env.port || 4000, function(){
	console.log('Now listening for requests');

    // Launch c2c initialization functions.
     c2c.c2c_init_latest_outing();

    // Launch algolia initialization functions.
    // algolia.algolia_init();
		// algolia.algolia_setting();
});
