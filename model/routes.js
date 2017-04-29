const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create geo location schema
const Geo_route = new Schema({
	type: {
		type: String,
		default: "Point"
	},
	coordinates: {
		type: [Number],
		index: "2dsphere"
	}
});

// Create routes schema & model
const RouteSchema = new Schema({
	title : {
		type: String,
		required: [true, 'Title field is required']
	},
	title_prefix : {
		type: String
	},
	summary: {
		type: String
	},
	document_id: {
		type: String
	},
	source: {
		type: String
	},
	activities: {
		type: [String]
	},
	 global_rating: {
		 type:String
	 },
	 geometry : Geo_route,
	 _geoloc : {
    lat : {type: Number},
    lng : {type: Number}
  }
});

// Create the model & Add the schema
const Routes = mongoose.model('routes', RouteSchema);

// export routes to other module
module.exports = Routes;
