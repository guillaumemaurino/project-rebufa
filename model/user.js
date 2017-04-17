var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
      external_id           : String,
      token        : String,
      email        : String,
      name         : String,
      provider     : String,
      photo        : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
