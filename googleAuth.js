var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const key = require('./key.json')
const express = require('express')
const app = express()
var http = require('http').createServer(app);
var passport = require('passport');


module.exports = {

    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passportUse: function(){
        passport.use(new GoogleStrategy({
            clientID: key.web.client_id,
            clientSecret: key.web.client_secret,
            callbackURL: "http://chatservice.ml/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            //console.log("User", profile)
            let user = {
                id: profile.id,
                name: profile.name,
                photo: profile.photos[0].value,
                locale: profile._json.locale,
            }
            return done(null, user);
        }
        ));
    },

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    appGetAuth: function(){
        app.get('/auth/google',
        passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));
    },

    // GET /auth/google/callback
    appGetAuthCallback: function(){
        app.get('/auth/google/callback', function (req, res, next) {
            passport.authenticate('google', function (err, user, info) {
                console.log('callback fonction: ')
                console.log(user)
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('/chat');
                }
                req.session.user = user
                console.log("après session user")
                res.redirect('/')
            })(req, res, next);
        });
    }

}