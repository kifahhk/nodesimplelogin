var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// setup file uploads
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, 'profile-' + Date.now() + '' + path.extname(file.originalname));    
  }
});
var upload = multer({ storage: storage });
// end of file upload setup

var User = require ('../models/user');

var saltHashPassword = require("../auth/hash");


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'User Profile' });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


router.get('/signup', function(req, res, next) {
  res.render('signup',{title:'Sign up'});
});

router.post('/signup', upload.single('profilephoto'), function(req, res, next) {

  if(req.file){   
    profilephoto = req.file.filename;
  } else {   
    profilephoto = 'placeholder.jpg';
  }
 
  // Form Validator
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('passwordconfirm','Passwords do not match').equals(req.body.password);

  // Check Errors  
  var errors = req.validationErrors(true); // true for mapped Errors

    
  if(errors){
  	res.render('signup', {
  		errors: errors,
  		old: req.body
  	});
  } else{
  	var newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: saltHashPassword(req.body.password),
      profilephoto: profilephoto
    });
    
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);
    });

    req.flash('success', 'You have been registered successfully');

    res.location('/');
    res.redirect('/');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    // compare passwords
    if(saltHashPassword(password) === user.password) {    
      return done(null, user);
    } else {
      return done(null, false, {message:'Invalid Password'});
    }
    
  });
}));

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login', 
    failureFlash: 'Invalid Username or Password'
  }),
  function(req, res) {  	
    req.flash('success', 'You are logged in');
    res.redirect('/');
});       

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/login');
});

module.exports = router;
