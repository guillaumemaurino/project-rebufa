const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create geo location schema
const SkiArea_obj = new Schema({
	id: {
		type: String
	},
	name: {
	type: String
},
official_website: {
type: String
},
geo_lat: {
type: String
},
geo_lng: {
type: String
}
});

const RegionsSkiArea_obj = new Schema({
	id: {
		type: String
	},
	ski_area_id: {
	type: String
},
region_id: {
type: String
},
temps_region: {
type: String
},
temps_country: {
type: String
}
});

const Region_obj = new Schema({
	id: {
		type: String
	},
	name: {
	type: String
},
RegionsSkiArea: RegionsSkiArea_obj
});



// Create routes schema & model
const SkiSchema = new Schema({
	Region : [Region_obj],
	SkiArea: SkiArea_obj
});

// Create the model & Add the schema
const Ski = mongoose.model('ski', SkiSchema);

// export routes to other module
module.exports = Ski;
