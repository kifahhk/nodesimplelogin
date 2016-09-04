var express = require('express');
var router = express.Router();

// file uploads
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{title:'Sign up'});
});

router.post('/signup', upload.single('profilephoto'), function(req, res, next) {
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
  	console.log('No Errors');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});



module.exports = router;
