const Routes = require('../model/routes');
const request = require('request'); //assuming you installed this module
const c2c_api = 'https://api.camptocamp.org';

var c2c_init_latest_outing = function(){
	var http = c2c_api + '/outings#bbox=-857237%252C3931838%252C1657236%252C7268161&date=2017-03-01%252C2017-03-31';
	request.get(http, function (err, res, body) {
		 if (!err) {
	    	console.log("Get recent outings from c2c API " + http);
	        var resultsObj = JSON.parse(body);
	        var documents = resultsObj.documents;
	        //console.log(documents);
	        var v_document_id = [];
	        for (var id in documents) {
			    if (!documents.hasOwnProperty(id)) {
			        //The current property is not a direct property of p
			        continue;
			    }
			    //Do your logic with the property here
			    v_document_id.push(documents[id].document_id);
			}

			// Now that we have the outings ids -> we request these & we are going to store them.
			for(var id in v_document_id){
				if (!v_document_id.hasOwnProperty(id)) {
			        //The current property is not a direct property of p
			        continue;
			    }
				c2c_init_outing(v_document_id[id]);
			}

	    }
	});
}

var c2c_init_outing = function(document_id){
	request.get(c2c_api + '/outings/' + document_id, function (err, res, body) {
		console.log("Get outing from c2c API " + document_id);
	    var resultsObj = JSON.parse(body);
	    var v_routes = resultsObj.associations.routes;
	    for (var id in v_routes){
	    	if (!v_routes.hasOwnProperty(id)) {
		        //The current property is not a direct property of p
		        continue;
		    }

		    // TODO in the future we should create an outing schema ....

		    // We get the route id
		    var route_id = v_routes[id].document_id;
	    	// We are going to init the route
	    	c2c_init_route(route_id);
	    }
	});
}

var c2c_init_route = function(document_id) {
	request.get(c2c_api + '/routes/' + document_id, function (err, res, body) {
	    if (!err) {
	    	console.log("Get route from c2c API " + document_id);
	        //Just an example of how to access properties:
	        var resultsObj = JSON.parse(body);
	        var locales = resultsObj.locales;
	    	if (resultsObj.status == 'error' && resultsObj.errors.length == 1 && resultsObj.errors[0].name == 'Not Found'){
	    		// Could be a classic case where the route is not found;
	    		console.log("Classic case we do not process.")
	    	}
	        else if (locales != undefined && locales.length > 0){
						var route_location = JSON.parse(resultsObj.geometry.geom);
						console.log(route_location.coordinates);
						console.log(route_location.type);

						var geometry = {
							coordinates: [route_location.coordinates[1],route_location.coordinates[0]],
							type: route_location.type
						};
						console.log(geometry)
		        var c2c_init_route = {
		        	title: locales[0].title,
		        	title_prefix: locales[0].title_prefix,
		        	summary: locales[0].summary,
		        	document_id: resultsObj.document_id,
		        	activities: resultsObj.activities,
							global_rating: resultsObj.global_rating,
							geometry: geometry,
		        	source: "c2c"
		        };

	        	var result = c2c_get_route(resultsObj.document_id, function(res){
	        		if (res != undefined){
	        			console.log("Route already imported. Should do an update.");
	        			// TODO here should be the update.
	        			Routes.findByIdAndUpdate({_id: res._id}, c2c_init_route).then(function(){
							// we do a get
							Routes.findOne({_id: res._id}).then(function(route){
								console.log("Update finished")
							});
						});
	        		}
	        		else{
	        			console.log("Route not existing. Should do a create.");
				        // Trying to create a new route
				        Routes.create(c2c_init_route).then(function(route){
								console.log("New route created.");
						});
	        		}
	        	});
	        }
	        else{
	    		console.log("Error case where the locales ")
	    		console.log(resultsObj);
	        }

	    }
	    else {
	    	console.log("Error in the request !");
	        console.log(err);
	    }
	});
};

var c2c_get_route = function(document_id, callback){
	// Trying to get route
	console.log(document_id);
	var query  = Routes.where({ document_id: document_id });
	query.findOne(function (err, route) {
	  if (err){
	  	console.log(err);
	  }
	  if (route){
	    // doc may be null if no document matched
	    callback(route);
	  }
	  else{
	  	callback(undefined);
	  }
	});
};

module.exports.c2c_init_latest_outing = c2c_init_latest_outing;
