const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create routes schema & model
const OutingSchema = new Schema({
	title: {
		type: String
	},
  description: {
    type: String
  },
  conditions: {
    type: String
  },
  participants: {
    type: String
  },
	document_id: {
		type: String
	},
	source: {
		type: String
  },
  date_start: {
    type: Date
  },
  date_end: {
    type: Date
  },
  route_ids: {
    type: [String]
  },
  user_ids: {
    type:[String]
  }
});

// Create the model & Add the schema
const Outings = mongoose.model('outings', OutingSchema);

// export routes to other module
module.exports = Outings;
