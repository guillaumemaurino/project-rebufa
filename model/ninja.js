const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Setting debug to true
mongoose.set('debug', true);
console.log("Debug mode enabled.")

// Create geo location schema
const GeoSchema = new Schema({
	type: {
		type: String,
		default: "Point"
	},
	coordinates: {
		type: [Number],
		index: "2dsphere"
	}
});


// Create ninja schema & model
const NinjaSchema = new Schema({
	name : {
		type: String,
		required: [true, 'Name field is required']
	},
	rank : {
		type: String
	},
	available: {
		type: Boolean,
		default: false
	},
	geometry : GeoSchema
	// Add in geo location by using a relation to the geoschema
});

// Create the model & Add the schema
const Ninja = mongoose.model('ninja', NinjaSchema);

// export ninja to other module
module.exports = Ninja;
