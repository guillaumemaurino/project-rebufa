const Routes = require('../model/routes');
const Outings = require('../model/outings');
const request = require('request'); //assuming you installed this module
const SphericalMercator = require('sphericalmercator');
const c2c_api = 'https://api.camptocamp.org';

var merc = new SphericalMercator({
    size: 256
});

var c2c_init_latest_outing = function(){
	var http = c2c_api + '/outings'; // #bbox=-857237%252C3931838%252C1657236%252C7268161&date=2017-03-01%252C2017-03-31';
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
						var outing_id = documents[id].document_id;
						c2c_init_outing(outing_id);
					}
	    }
	});
}

var add_route_to_outing = function(outing, new_route){
    Outings.findOne({_id: outing._id}).then(function(new_outing){
      new_outing.route_ids.push(new_route._id);
      Outings.findByIdAndUpdate({_id: outing._id}, new_outing).then(function(){
        console.log("Route added to the outing");
      });
    });
}

var c2c_init_outing = function(document_id){
	console.log("Get outing from c2c API " + document_id);
	request.get(c2c_api + '/outings/' + document_id, function (err, res, body) {
		var resultsObj = JSON.parse(body);
		var locales = resultsObj.locales;
		var v_routes = resultsObj.associations.routes;
		var v_users = resultsObj.associations.users;
		var user_ids = [];
		var route_ids = [];
		// GMAURINO We get all the routes associated to the outing.
		for (var id in v_routes){
			if (!v_routes.hasOwnProperty(id)) {
				//The current property is not a direct property of p
				continue;
			}
			// We get the route id
			var route_id = v_routes[id].document_id;
			//route_ids.push(route_id);
			// We are going to init the route
			c2c_init_route(route_id, function(route){
        console.log("GMAURINO TODO maybe add the route to the outing.");
      });
		}

		if (locales != undefined && locales.length > 0){
			// GMAURINO Creating the outing schema ....
			var c2c_init_outing = {
				title: locales[0].title,
				description: locales[0].description,
				conditions: locales[0].conditions,
				participants: locales[0].participants,
				document_id: resultsObj.document_id,
				source: "c2c",
				date_start: resultsObj.date_start,
				date_end: resultsObj.date_end
      };
			//console.log(c2c_init_outing);

			var result = c2c_get_outing(c2c_init_outing, function(res, c2c_init_outing){
				if (res != undefined){
					// GMAURINO we do an update.
          console.log("Outing found : " + res.title + "/ id " + res._id + ". Updating with new values from c2c : " + c2c_init_outing.title)
					Outings.findByIdAndUpdate({_id: res._id}, c2c_init_outing).then(function(){
						// we do a get
						Outings.findOne({_id: res._id}).then(function(outing){
							console.log("Outing already existing : Update finished on " + outing._id)
						});
					});
				}
				else{
					// Trying to create a new outing
					Outings.create(c2c_init_outing).then(function(outing){
						console.log("New outing created : " + outing._id + " for " + c2c_init_outing.title);
					});
				}
			});
		}

	});
}

var c2c_init_route = function(document_id, callback) {
	request.get(c2c_api + '/routes/' + document_id, function (err, res, body) {
	    if (!err) {
	    	console.log("Init route from c2c API " + document_id);
	        //Just an example of how to access properties:
	        var resultsObj = JSON.parse(body);
	        var locales = resultsObj.locales;
	    	if (resultsObj.status == 'error' && resultsObj.errors.length == 1 && resultsObj.errors[0].name == 'Not Found'){
	    		// Could be a classic case where the route is not found;
	    		console.log("Classic case we do not process.")
	    	}
	        else if (locales != undefined && locales.length > 0){
						var route_location = JSON.parse(resultsObj.geometry.geom);

						// GMAURNINO - Need to translate coordinates from EPS:3857 (Mercator) to classic Longitude & Latitude.
						// This can be done using sphericalmercator check out the doc on NPN.
						var new_geo = merc.inverse(route_location.coordinates);
						var geometry = {
							coordinates: new_geo,
							type: route_location.type
						};
            var summary = locales[0].summary;
            if (summary == null){summary = locales[0].description;}
		        var c2c_init_route = {
		        	title: locales[0].title,
		        	title_prefix: locales[0].title_prefix,
		        	summary: summary,
		        	document_id: resultsObj.document_id,
		        	activities: resultsObj.activities,
							global_rating: resultsObj.global_rating,
							geometry: geometry,
              _geoloc: {
                lat: new_geo[1],
                lng: new_geo[0]
              },
		        	source: "c2c"
		        };

	        	var result = c2c_get_route(c2c_init_route, function(res, c2c_init_route){
	        		if (res != undefined){
	        			//console.log("Route already imported. Should do an update.");
                console.log("Route found : " + res.title + "/ id " + res._id + ". Updating with new values from c2c : " + c2c_init_route.title)
	        			Routes.findByIdAndUpdate({_id: res._id}, c2c_init_route).then(function(){
							// we do a get
							Routes.findOne({_id: res._id}).then(function(route){
								console.log("Route already existing : Update finished on " + route._id)
                callback(route);
							});
						});
	        		}
	        		else{
	        			//console.log("Route not existing. Should do a create.");
				        // Trying to create a new route
				        Routes.create(c2c_init_route).then(function(route){
								console.log("New route created : " + route._id + " for route " + route.title);
                callback(route);
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

var c2c_get_route = function(init_route, callback){
	// Trying to get route
  var document_id = init_route.document_id;
	//console.log('Getting route from mongoose ' + document_id);
	var query  = Routes.where({ document_id: document_id });
	query.findOne(function (err, route) {
	  if (err){
	  	//console.log(err);
	  }
	  if (route){
	    // doc may be null if no document matched
	    callback(route, init_route);
	  }
	  else{
	  	callback(undefined, init_route);
	  }
	});
};

var c2c_get_outing = function(init_outing, callback){
	// Trying to get outing
  var document_id = init_outing.document_id;

	//console.log('Getting outing from mongoose ' + document_id);
	var query  = Outings.where({ document_id: document_id });
	query.findOne(function (err, outing) {
	  if (err){
	  	//console.log(err);
	  }
	  if (outing){
	    // doc may be null if no document matched
	    callback(outing, init_outing);
	  }
	  else{
	  	callback(undefined, init_outing);
	  }
	});
};

module.exports.c2c_init_latest_outing = c2c_init_latest_outing;
