// Algolia search
const algoliasearch = require('algoliasearch');
const Routes = require('../model/routes');
const Outings = require('../model/outings');
const Ski = require('../model/ski');
const Users = require('../model/user');

// Guillauem algolia parameters....
const applicationID = 'TR971CJDWI';
const apiKey = '4e93ff805c19864e7e343011ef3dc93c';

// Antoine algolia parameters ....
//const applicationID = 'S4KUBACX2X';
//const apiKey = 'd813e9b18ac817123377a9a4d0ab2f92';
// We set up the client
const client = algoliasearch(applicationID, apiKey);

// We set up the index -> routes & outings.
const index_routes = client.initIndex('routes');
const index_outings = client.initIndex('outings');
const index_users = client.initIndex('users');
const index_ski = client.initIndex('ski');

const algolia_init = function(){
	// Going to try to get the content of all the routes from MondoDB and upload it to Algolia
	algolia_init_one(Routes, index_routes);
	algolia_init_one(Outings, index_outings);
	algolia_init_one(Users, index_users);
	algolia_init_one(Ski, index_ski);
}

const algolia_init_one = function(index_db, index_algolia){
	// Going to try to get the content of all the routes from MondoDB and upload it to Algolia
	index_db.find().then(function(all_obj) {
		// We clear the index
		index_algolia.clearIndex(function(err, content) {
		  if (err) {
		    console.error(err);
		  }
			else{
				index_algolia.waitTask(content.taskID, function(err) {
					if (err) { console.error(err); }
					else{
						// If the index is cleared we populate it back !
						index_algolia.addObjects(all_obj, function(err, content) {
							if (err) {console.error(err);}
							else {
								console.log("All objects imported to Algolia.");
								console.log(index_algolia.indexName);
							}
						});
					}
				});
			}
		});
	});
}

const algolia_setting = function() {
	index_routes.setSettings({
	  searchableAttributes: ['title,title_prefix','activities','summary'],
		attributesForFaceting: ['source', 'activities', 'global_rating']
	});
	console.log("Settings: routes done.")
	index_routes.getSettings(function(err, content) {
	  //console.log(content);
	});
	index_ski.setSettings({
		searchableAttributes: ['_id','skiArea','Region'],
		attributesForFaceting: ['skiArea','Region']
	});
		console.log("Settings: ski done.")
		index_ski.getSettings(function(err, content) {
		  //console.log(content);
		});

	index_outings.setSettings({
		searchableAttributes: ['title','conditions','participants','user_ids'],
		attributesForFaceting: ['source', 'user_ids']
	});

	console.log("Settings: outings done.")
	index_outings.getSettings(function(err, content) {
		//console.log(content);
	});

	index_users.setSettings({
		searchableAttributes: ['email','name','summary'],
		attributesForFaceting: ['provider']
	});

	console.log("Settings: users done.")
	index_users.getSettings(function(err, content) {
		//console.log(content);
	});
}

module.exports.algolia_init = algolia_init;
module.exports.algolia_setting = algolia_setting;
