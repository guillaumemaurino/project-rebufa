module.exports = function(app) {

    // normal routes ===============================================================
    app.get('/', function(req, res){
      res.render('home', {
        user : req.user
      });
    });

    app.get('/map', function(req, res){
      res.render('map', {
          user : req.user
      });
    });

    app.get('/routes', function(req, res){
    	res.render('routes', {
        search: req.query.search,
        user: req.user
      });
    });

    app.get('/test_style', function(req, res){
      res.render('test_style', {
          user : req.user
      });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};
