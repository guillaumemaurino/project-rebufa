const fs = require("fs");
const User = require('../model/user');
//const isLoggedIn = require('./login.js').isLoggedIn;
const multer = require("multer");
// Setting upload path for file exchange
const upload = multer({dest: "./uploads"});

module.exports = function(app, gfs) {

  app.get('/users/:id', function(req, res, next){
  	console.log('GET users request');
  	User.findOne({_id: req.params.id}).then(function(user){
  			res.send(user);
  	});
  });

  // Update request of existing ninja
  app.put('/users/:id', function(req, res, next){
  	console.log('PUT users request');
  	console.log(req.params.id);
  	console.log(req.body);
  	User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
  		// we do a get
  		User.findOne({_id: req.params.id}).then(function(user){
  			res.send(user);
  		});
  	});
  });


    // Update request of existing user for the summary line
    app.put('/users_summary', function(req, res, next){
      console.log('PUT users summary request');
      var new_user = req.user;
      console.log(req.user);
      if (new_user){
        console.log(req.body);
        new_user.summary = req.body.summary;
        User.findByIdAndUpdate({_id: new_user.id}, new_user).then(function(){
          // we do a get
          User.findOne({_id: new_user.id}).then(function(user){
            res.send(user);
          });
        });
      }
    });

  //second parameter is multer middleware.
  app.post("/profile/picture", upload.single("avatar"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    console.log(writestream.id)
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){
        fs.unlink("./uploads/"+ req.file.filename, function(err){
          // Try to get the user
          var new_user = req.user;
          if (new_user){
            new_user.photo = '/files/' + writestream.id;
            User.findByIdAndUpdate({_id: req.user.id}, new_user).then(function(){
          		// we do a get
          		User.findOne({_id: req.user.id}).then(function(user){
          			//res.send(user
                res.redirect('/profile');
          		});
          	});
          }
        })
      })
      .on("data", function(data) {
        //console.log(data);
        //res.write(data);
    })
      .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  });

  //second parameter is multer middleware.
  app.post("/profile/background", upload.single("avatar"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    console.log(writestream.id)
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){
        fs.unlink("./uploads/"+ req.file.filename, function(err){
          // Try to get the user
          var new_user = req.user;
          if (new_user){
            new_user.background = '/files/' + writestream.id;
            User.findByIdAndUpdate({_id: req.user.id}, new_user).then(function(){
              // we do a get
              User.findOne({_id: req.user.id}).then(function(user){
                //res.send(user
                res.redirect('/profile');
              });
            });
          }
        })
      })
      .on("data", function(data) {
        //console.log(data);
        //res.write(data);
    })
      .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  });


  // sends the image we saved by filename.
  app.get("/files/:file_id", function(req, res){
      var readstream = gfs.createReadStream({_id: req.params.file_id});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });

  //delete the image
  app.get("/delete/:file_id", function(req, res){
    gfs.exist({_id: req.params.file_id}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({_id: req.params.file_id}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });

};
