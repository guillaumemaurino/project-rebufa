const bodyParser   = require('body-parser');
const Outings = require('../model/outings');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const utils = require('./utils.js')

module.exports = function(app){

	app.get('/outings' , utils.isLoggedIn, function(req, res){
		// Getting data from mongo dg & pass it to the view
		console.log('Getting outings called.')
		var user_id = req.user._id;
		console.log(user_id);
		Outings.aggregate([
			{$match:
				{'user_ids': user_id}
			},
			{
				$unwind: "$route_ids",
				$unwind: "$user_ids"
			},
			{
				$lookup:
				{
					from: "routes",
					localField: "route_ids",
					foreignField: "_id",
					as: "routes_information"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "user_ids",
					foreignField: "_id",
					as: "users_information"
				}	
    }], function (err, data){
			if (err) throw err;
			console.log(data);
			res.render('outings', {
				outings: data,
				user: req.user
			});
		});
	});

	app.post('/outings' , utils.isLoggedIn , function(req, res){
		// Get the data from the view & add it to the mongo db
		console.log('Posting new outing :');
		//console.log(req.body);
		//console.log(req.user);
		var new_outing = req.body;
		new_outing.user_ids = [req.user._id];
		console.log(new_outing);
		Outings.create(new_outing).then(function(err,data){
			if (err) throw err;
			//res.json(data);
		});
	});

	app.delete('/outings/:item' , function(req, res){
		// Find & delete the item from Mongo db
		Outings.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
			if (err) throw err;
			res.json(data);
		});
	});

};
