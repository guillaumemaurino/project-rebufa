const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create an activity schema & model
const ActivitySchema = new Schema({
	name : {
		type: String,
		required: [true, 'Name field is required']
	},
	icon_path : {
		type: String
	},
	description: {
		type: String
	}
});

// Create the model & Add the schema
const Activity = mongoose.model('activity', ActivitySchema);

// export ninja to other module
module.exports = Activity;
