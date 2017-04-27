// Algolia search
const algoliasearch = require('algoliasearch');
const Routes = require('../model/routes');
const Outings = require('../model/outings');
const Ski = require('../model/ski');

const applicationID = 'TR971CJDWI';
const apiKey = '4e93ff805c19864e7e343011ef3dc93c';

// We set up the client
const client = algoliasearch(applicationID, apiKey);

// We set up the index -> routes & outings.
const index_routes = client.initIndex('routes');
const index_outings = client.initIndex('outings');
const index_ski = client.initIndex('ski');


const algolia_init = function(){
	// Going to try to get the content of all the routes from MondoDB and upload it to Algolia
	Routes.find().then(function(all_routes) {
		// We clear the index
		index_routes.clearIndex(function(err) {
		  if (err) {
		    console.error(err);
		  }
		});
		index_routes.addObjects(all_routes, function(err, content) {
		  if (err) {console.error(err);}
			else {console.log("All routes imported to Algolia.")}
		});
	});

	Ski.find().then(function(all_skis) {
		// We clear the index
		index_ski.clearIndex(function(err) {
		  if (err) {
		    console.error(err);
		  }
		});
		index_ski.addObjects(all_skis, function(err, content) {
		  if (err) {console.error(err);}
			else {console.log("All skis imported to Algolia.")}
		});
	});

	// Going to try to get the content of all the outings from MondoDB and upload it to Algolia
	Outings.find().then(function(all_outings) {
		// We clear the index
		index_outings.clearIndex(function(err) {
		  if (err) {
		    console.error(err);
		  }
		});
		index_outings.addObjects(all_outings, function(err, content) {
		  if (err) {console.error(err);}
			else {console.log("All outings imported to Algolia.")}
		});
	});
}


const algolia_setting = function() {
	index_routes.setSettings({
	  searchableAttributes: ['title,title_prefix','activities','geometry','summary'],
		attributesForFaceting: ['source', 'activities', 'global_rating']
	});




	console.log("Settings: routes done.")


	index_routes.getSettings(function(err, content) {
	  //console.log(content);
	});

	index_ski.setSettings({
		searchableAttributes: ['_id','skiArea','Region'],
		attributesForFaceting: ['_id','skiArea','Region']
	});

		console.log("Settings: ski done.")
		index_ski.getSettings(function(err, content) {
		  console.log(content);
		});

	index_outings.setSettings({
		searchableAttributes: ['title','conditions','participants','user_ids'],
		attributesForFaceting: ['source', 'user_ids']
	});

	console.log("Settings: outings done.")
	index_outings.getSettings(function(err, content) {
		//console.log(content);
	});
}

module.exports.algolia_init = algolia_init;
module.exports.algolia_setting = algolia_setting;
