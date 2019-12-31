const express = require('express')
const app = express()
const key = require('./key.json')
var path = require('path');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var port = 8080
app.use(passport.initialize());
app.use(passport.session());
User = {
    id: '',
    name: {
        familyName: '',
        givenName: '',
    },
    photo: '',
    locale: '',
}

function findOrCreate() {
    User.id = profile.id
    User.name = profile.name
    User.photo = profile.photos[0].value
    User.locale = profile._json.locale
    return User
}


passport.serializeUser(function (user, done) {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
});
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: key.web.client_id,
        clientSecret: key.web.client_secret,
        callbackURL: "http://chatservice.ml/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("User", profile)
        User.id = profile.id
        User.name = profile.name
        User.photo = profile.photos[0].value
        User.locale = profile.locale
        return done(null, User);
    }
));




function isUserConnected() {
    if (User.id != '' && User.name.familyName != '' && User.name.givenName != '') {
        return true
    } else {
        return false
    }
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/chat', function (req, res) {
    console.log("User is connected: ", isUserConnected(), User)
    if (isUserConnected()) {
        res.sendFile(path.join(__dirname + '/chat.html'));
    } else {
        res.redirect('/');
    }

});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})






// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google'
    }),
    function (req, res) {
        res.redirect('/chat');
    });