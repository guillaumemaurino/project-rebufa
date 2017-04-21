// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../model/user');

// load the auth variables
var configAuth = require('./login'); // use this one for testing

module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
    function(req, token, refreshToken, profile, done) {

      console.log('facebook profile - debug');
      //console.log(profile);
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user) {
              var fb_email = (profile.emails[0].value || '').toLowerCase()
                User.findOne({ 'email' : fb_email}, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                      console.log('Creating new User with facebook.')
                      user = new User();
                      user.external_id    = profile.id;
                      user.provider = profile.provider;
                    }
                    if (user && user.provider == 'facebook') {
                        // if there is a user id already
                        console.log('User already existing, we do an update');
                        user.token = token;
                        user.email = fb_email;
                        // GMAURINO for now if the user already exist we do not udpate the name & picture.
                        //user.name  = profile.displayName ? profile.displayName : profile.name.givenName + ' ' + profile.name.familyName;
                        //user.photo = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg';

                        user.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });
                    }
                    else{
                      console.log('User already existing but not login with facebook. Should warn the user.')
                    }
                });
            }
        });
    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
      console.log('google profile - debug');
      //console.log(profile);
        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {
                var google_email = (profile.emails[0].value || '').toLowerCase()
                User.findOne({ 'email' : google_email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                      console.log('Creating new User with google.')
                      user = new User();
                      user.external_id    = profile.id;
                      user.provider = profile.provider;
                    }
                    if (user && user.provider == 'google') {
                        // if there is a user id already
                        console.log('User already existing, we do an update');
                            user.token = token;
                            user.email = google_email; // pull the first email
                            // For now we do not update the dsplay name any more
                            // user.name  = profile.displayName;
                            // user.photo = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg';

                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }
                        else{
                          console.log('User already existing but not login with google. Should warn the user.')
                        }
                });
            }
        });

    }));


};
