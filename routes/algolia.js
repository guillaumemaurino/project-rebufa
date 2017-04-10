// Algolia search
const algoliasearch = require('algoliasearch');
const Routes = require('../model/routes');


const applicationID = 'TR971CJDWI';
const apiKey = '4e93ff805c19864e7e343011ef3dc93c';


// We set up the client
const client = algoliasearch(applicationID, apiKey);

// We set up the index -> routes.
const index_routes = client.initIndex('routes');


const algolia_init = function(){

	// Going to try to get the content of all the routes from MondoDB and upload it to Algolia
	Routes.find().then(function(all_routes) {
		//console.log(all_routes);

		// We clear the index
		index_routes.clearIndex(function(err) {
		  if (err) {
		    console.error(err);
		  }
		});
		index_routes.addObjects(all_routes, function(err, content) {
		  if (err) {
		    console.error(err);
		  }
			else {
				{
					console.log("All routes imported to Algolia.")
				}
			}
		});
	});
}

const algolia_setting = function() {
	index_routes.setSettings({
	  searchableAttributes: ['title,title_prefix','activities','summary'],
		attributesForFaceting: ['source', 'activities']
	});
console.log("Settings: searchableAttributes done.")

	index_routes.getSettings(function(err, content) {
	  console.log(content);
	});

}

module.exports.algolia_init = algolia_init;
module.exports.algolia_setting = algolia_setting;
