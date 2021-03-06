const express = require('express');
const passport = require('passport');
const router = express.Router();


const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:
    process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', passport.authenticate('auth0', {
  clientID: env.AUTH0_CLIENT_ID,
  domain: env.AUTH0_DOMAIN,
  redirectUri: env.AUTH0_CALLBACK_URL,
  responseType: 'code',
  sso:true,
  audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
  scope: 'openid profile'}),
  function(req, res) {
    res.redirect("/");
});


router.get('/callback', passport.authenticate('auth0', { failureRedirect: '/custom' }),function(req, res) {
    console.log("Inside callback");
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/custom', function(req, res) {
  var error = req.flash("error"); 
  var error_description = req.flash("error_description"); 
  var AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
  var AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
  req.logout();
  res.render('custom', {
    error: error[0], 
    error_description: error_description[0], 
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
