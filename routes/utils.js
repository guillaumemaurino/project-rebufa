var exports = module.exports = {};

// route middleware to ensure user is logged in
exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated())
  return next();
  res.redirect('/');
}
