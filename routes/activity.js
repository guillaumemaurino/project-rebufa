const Activities = require('../model/activity');

var init_activities = function(){

  // GMAURINO Creating the outing schema ....
  var init_activities_vect = [];
  init_activities_vect.push({name: 'skitouring', description: 'Ski touring', icon_path: 'assets/icons/skitouring.png' });
  init_activities_vect.push({name: 'snow_ice_mixed', description: 'Snow / ice / mixed', icon_path: 'assets/icons/snow_ice_mixed.png' });
  // Antoine todo add the other activities here .....

  //console.log(init_activities_vect);


  for (var id in init_activities_vect){
    if (!init_activities_vect.hasOwnProperty(id)) {
      //The current property is not a direct property of p
      continue;
    }
    // We get the route id
    var init_activity = init_activities_vect[id];
    //console.log(init_activity);
    var result = get_activity(init_activity, function(res, init_activity){
      if (res != undefined){
        // GMAURINO we do an update.
        console.log('Updating ' + res.name + ' with new value ' + init_activity.name)
        Activities.findByIdAndUpdate({_id: res._id}, init_activity).then(function(){
          // we do a get
          Activities.findOne({_id: res._id}).then(function(activity){
            console.log("Activity already existing for : " + init_activity.name + ". Update finished on " + activity._id)
          });
        });
      }
      else{
        // Trying to create a new activity
        Activities.create(init_activity).then(function(activity){
          console.log("New activity created : " + activity._id + " for " + init_activity.name);
        });
      }
    });
  }
}

var get_activity = function(init_activity, callback){
	// Trying to get outing
  var act_name = init_activity.name;
	//console.log('Getting activity from mongoose ' + act_name);
  Activities.findOne({name: act_name}).then(function(activity){
	  if (activity){
	    // doc may be null if no document matched
      //console.log('Result :');
      //console.log(activity);
	    callback(activity, init_activity);
	  }
	  else{
      //console.log('Result undefined...')
	  	callback(undefined, init_activity);
	  }
	});
};

module.exports.init_activities = init_activities;
