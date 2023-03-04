const express = require('express');
const passport = require('passport');
const UserService = require('../../services/userServices/userServices');
const router = express.Router();
const GoogleStragey = require('passport-google-oauth20').Strategy;

const successLoginUrl = 'http://localhost:3000/login/success';
const failedLoginUrl = 'http://localhost:3000/login/failture';

passport.use(
  new GoogleStragey(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log('profile');
      // use profile to find someone
      console.log(profile.id);
      let foundUser = await UserService.findByGoogleId(profile.id);
      if (!foundUser !== 'undefined' && foundUser.length === 0) {
        foundUser = await UserService.findUserByEmail(profile.emails[0].value);
      }
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log('serializer');
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  console.log('deserializer');
  done(null, user);
});

router
  .get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )
  .get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: failedLoginUrl,
      successRedirect: successLoginUrl,
    }),
    (req, res) => {
      console.log(req.user);
      res.send('Thanks for signing in');
    }
  )
  .get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    req.redirect('/');
  })
  .get('/error', (req, res) => {
    console.log('error');
    res.send('No dice');
  })
  .get('/success', (req, res) => {
    res.send('you did it');
  });

module.exports = router;
