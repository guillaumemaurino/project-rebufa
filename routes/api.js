const express = require('express');
const router = express.Router();
const Ninja = require('../model/ninja');

// exporting router
module.exports = router;

// Get a list of ninjas from database
router.get('/ninjas', function(req, res, next){
	console.log('GET request');
	// We are going to use the URL parameteres: both longitude & longitude
	Ninja.geoNear(
		{type : 'Point', coordinates: [parseFloat(req.query.lng) , parseFloat(req.query.lat)]},
		{maxDistance : 10000000, spherical: true}
	).then(function(ninjas){
		res.send(ninjas);
	});
	//res.send({ type : 'GET'});
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
