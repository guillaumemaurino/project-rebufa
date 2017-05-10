// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1912762422329843', // your App ID
        'clientSecret'    : '1e1d5eb64f5daa85cbb2d0029ff79029', // your App Secret
        'callbackURL'     : '/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'displayName', 'email', 'picture.type(large)']

    },
    'googleAuth' : {
        'clientID'         : '1068653630104-qvob64k7i0vv0tlpstn8ssqe41dugd8k.apps.googleusercontent.com',
        'clientSecret'     : 'dbV9ArfF-4Vk2thAmbLz3z8a',
        'callbackURL'      : '/auth/google/callback'
    }
};
