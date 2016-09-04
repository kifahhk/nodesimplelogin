var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{title:'Sign up'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

module.exports = router;
