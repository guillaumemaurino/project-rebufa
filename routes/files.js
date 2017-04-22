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

  //second parameter is multer middleware.
  app.post("/profile/picture", upload.single("avatar"), function(req, res, next){
    console.log('User profile picture change called.')
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
            // We should delete the previous file if we can.
            req.params.file_id = new_user.photo.file_id;
            delete_file(req, res, next);
              new_user.photo = {
                file_id : writestream.id,
                url     : '/files/' + writestream.id
              };
              User.findByIdAndUpdate({_id: req.user.id}, new_user).then(function(){
                // we do a get
                User.findOne({_id: req.user.id}).then(function(user){
                  //res.send(user
                  console.log('User information updated with new profile picture')
                  res.redirect('/profile');
                });
              });

          }// end of if condition
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
            // We should delete the previous file if we can.
            req.params.file_id = new_user.background.file_id;
            delete_file(req, res, next);
            new_user.background = {
              file_id : writestream.id,
              url     : '/files/' + writestream.id
            };
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
  app.get("/delete/:file_id", function(req, res, next){
    delete_file(req, res, next);
  });

  function delete_file(req, res, next){
    var file_id = req.params.file_id;
    console.log("deleting file called.")
    console.log(req.params);
    gfs.exist({_id: file_id}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({_id: file_id}, function(err){
          if(err) return res.send("Error occured");
          console.log("Image deleted!");
          //res.writeContinue();
        });
      } else{
        console.log("No image found with that title");
        //res.writeContinue();
      }
    });
  }

};
