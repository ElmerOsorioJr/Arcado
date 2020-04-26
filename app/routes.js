const PictureUploads = require('./models/pictureUpload.js')
module.exports = function(app, passport, db, multer, ObjectId) {

  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + ".png")
      }
  });
  var upload = multer({storage: storage});

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let uId = ObjectId(req.session.passport.user)
        // db.collection('data').find().toArray((err, result) => {
          // console.log(result)
          db.collection('pictureuploads').find({'posterId': uId}).toArray((err, result) => {
            // console.log(result)
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result,
            pinnedImage: result,
            })
          })
        // })
    });

    app.get('/feed', isLoggedIn, function(req, res) {
        db.collection('data').find().toArray((err, result) => {
          db.collection('pictureuploads').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('feed.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result
          })
        })
      })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.put('/pin', (req, res) => {
      let uId = ObjectId(req.session.passport.user)
      // console.log("pinned image route")
      console.log(req.body.pinnedImage)
      db.collection('users')
      .findOneAndUpdate({_id: uId}, {
        // to update in object use quotes with dot notation :)
         $push: {'local.favoritePics': req.body.pinnedImage}
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.post('/pictureUpload', upload.single('file-to-upload'), (req, res, next) => {
      let uId = ObjectId(req.session.passport.user)
      let userEmail = req.user.local.email
      const newPicture = new PictureUploads({
        userEmail: userEmail,
        posterId: uId,
        caption: req.body.caption,
        likes: 0,
        imgPath: 'images/uploads/' + req.file.filename,
      })
      newPicture.save()
      .then(picture => {
        console.log(picture)
      })
      res.redirect('/profile')
    });

    //DIRECT MESSAGES========
    app.post('/directMessage', (req, res) => {
      let userPage = req.headers.referer
      let senderId = ObjectId(req.session.passport.user)
      let senderEmail = req.user.local.email
      let recieverId = ObjectId(req.body.recieverId)

      db.collection('users')
      .update({_id: recieverId}, {
        $push: {'local.messages': {
          senderId: senderId,
          senderEmail: senderEmail,
          message: req.body.message
        } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect(userPage)
      })
    })

    //DELETE MESSAGE=================
    setTimeout(function() {
}, 3000);
    app.post('/deleteMessage', (req, res) => {
      let userPage = req.headers.referer
      let senderId = ObjectId(req.session.passport.user)
      console.log(senderId)
      let senderEmail = req.user.local.email
      console.log(req.body)
      let recieverId = ObjectId(req.body.recieverId)

      db.collection('users')
      .update({_id: senderId}, {
        $pull: {'local.messages': {
          message: req.body.thisMessage
        } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect(userPage)
      })
    })

    // INDIVIDUAL PROFILE PAGE =========================
    app.get('/userProfile/:zebra', function(req, res) {
        let postId = ObjectId(req.params.zebra)
        console.log(postId);
        db.collection('pictureuploads').find({posterId: postId}).toArray((err, result) => {
          console.log(result)
          if (err) return console.log(err)
          res.render('userProfile.ejs', {
            user: req.user,
            pictureUpload: result
          })
        })
    });

    app.put('/likePicture', (req, res) => {
      db.collection('pictureuploads')
      .findOneAndUpdate({_id: ObjectId(req.body._id), caption: req.body.caption}, {
        $set: {
          likes:req.body.likes + 1
        }
      }, {
        sort: {_id: 1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.post('/comment', (req, res) => {
      let userPage = req.headers.referer
      console.log(userPage)
      // console.log("from comment route", req.body)
      let pictureId = ObjectId(req.body.pictureId)
      console.log('this is pictureId' + pictureId)
      let commentPosterId = ObjectId(req.user._id)
      // console.log(commentPosterId)
      let commentPosterEmail = req.user.local.email
      console.log(commentPosterEmail)
      PictureUploads.findOneAndUpdate({_id: pictureId}, {
         $push: {comments: {
           CommentPosterId: commentPosterId,
           commentPosterEmail: commentPosterEmail,
           CommentPost: req.body.comment
         } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        if (userPage =='http://localhost:8000/profile' ){
          res.redirect('/profile')
        } else{
          res.redirect('/feed')
        }
      })
    })


    app.post('/deleteComment', (req, res) => {
      let userPage = req.headers.referer
      console.log(userPage)
      console.log(req.body)
      let pictureId = ObjectId(req.body.pictureId)
      console.log('this is pictureId' + pictureId)
      let commentPosterId = ObjectId(req.user._id)
      // console.log(commentPosterId)
      let commentPosterEmail = req.user.local.email
      console.log(commentPosterEmail)
      PictureUploads.findOneAndUpdate({_id: pictureId}, {
         $pull: {comments: {
           CommentPosterId: commentPosterId,
         } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        if (userPage =='http://localhost:8000/profile' ){
          res.redirect('/profile')
        } else{
          res.redirect('/feed')
        }
      })
    })


    app.delete('/deletePost', (req, res) => {
      // console.log(req.body)
      db.collection('pictureuploads').findOneAndDelete({_id: ObjectId(req.body._id), posterId: ObjectId(req.body.posterId)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
