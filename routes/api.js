const express = require('express');
const router = express.Router();
const Ninja = require('../model/ninja');
const User = require('../model/user');

// exporting router
module.exports = router;

// Get a list of ninjas from database
router.get('/ninjas', function(req, res, next){
	console.log('GET ninja request');
	// We are going to use the URL parameteres: both longitude & longitude
	Ninja.geoNear(
		{type : 'Point', coordinates: [parseFloat(req.query.lng) , parseFloat(req.query.lat)]},
		{maxDistance : 10000000, spherical: true}
	).then(function(ninjas){
		res.send(ninjas);
	});
	//res.send({ type : 'GET'});
});

router.get('/users/:id', function(req, res, next){
	console.log('GET users request');
	User.findOne({_id: req.params.id}).then(function(user){
	//User.find({}).then(function(user){
		//console.log(user);
			res.send(user);
	});
});

// Update request of existing ninja
router.put('/users/:id', function(req, res, next){
	console.log('PUT users request');
	console.log(req.params.id);
	console.log(req.body);
	User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		// we do a get
		User.findOne({_id: req.params.id}).then(function(user){
			res.send(user);
		});
	});
});

// Posting a new ninjas to database
router.post('/ninjas', function(req, res, next){
	console.log('POST request');
	// Create a new ninja in mongo DB & then send the response or if there is an error -> use the 3rd midelware defined in the index file
	Ninja.create(req.body).then(function(ninja){
		res.send(ninja);
	}).catch(next);
});


// Update request of existing ninja
router.put('/ninjas/:id', function(req, res, next){
	console.log('PUT request');
	Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		// we do a get
		Ninja.findOne({_id: req.params.id}).then(function(ninja){
			res.send(ninja);
		});
	});
});

// Delete a ninja from the database
router.delete('/ninjas/:id', function(req, res, next){
	console.log('DELETE request');
	Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja){
		res.send(ninja);
	});
});
