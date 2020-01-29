const express = require('express')
const app = express()
var http = require('http').createServer(app);
const key = require('./key.json')
var session = require('express-session')
var path = require('path');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var port = 8080
var io = require('socket.io')(http);
app.use(passport.initialize());
app.use(passport.session());
app.disable('x-powered-by');
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log(msg)
        io.emit(msg.salon, msg);
    });
});

app.use(express.static('public'));

app.use(session({
    secret: 'Le carre de l hypothenuse',
    resave: false,
    saveUninitialized: false,
    /* cookie: {
         secure: true
     }*/
}))


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
    //console.log("User is connected: ", isUserConnected(), User)
    console.log("session user: ", req.session)
    if (req.session.user) {
        res.sendFile(path.join(__dirname + '/chat.html'));
    } else {
        res.redirect('/');
    }

});
app.get('/getUserConnected', function (req, res) {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401);
        res.render('error', {
            error: '401 Unauthorized'
        });
    }

});


http.listen(port, function () {
    console.log(`L'application écoute le port ${port}!`)
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
/*
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google'
    }),
    function (req, res) {
        res.redirect('/chat');
    });

*/

app.get('/auth/google/callback', function (req, res, next) {
    passport.authenticate('google', function (err, user, info) {
        console.log('callback fonction: ')
        console.log(user)
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/');
        }
        req.session.user = user
        console.log("après session user")
        res.redirect('/chat')
    })(req, res, next);
});