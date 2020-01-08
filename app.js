const googleAuth = require('./googleAuth')

const express = require('express')
const app = express()
var http = require('http').createServer(app);
var session = require('express-session')
var path = require('path');
var passport = require('passport');
var port = 8080
var io = require('socket.io')(http);
app.use(passport.initialize());
app.use(passport.session());
app.disable('x-powered-by');
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});




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
//googleAuth.passportUse();




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
    //setTestUser(req);
    console.log("session user: ", req.session)
    if (req.session.user) {
        res.sendFile(path.join(__dirname + '/chat.html'));
    } else {
        res.redirect('/');
    }

});

//Mock d'un utilisateur pour utiliser en local.

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
    console.log(`Example app listening on port ${port}!`)
})

googleAuth.appGetAuth();
googleAuth.appGetAuthCallback();
function setTestUser(req){
    req.session.user = {
        id: 1,
        name: {
            familyName: 'Montagne',
            givenName: 'Wilfried',
        },
        photo: 'https://picsum.photos/200/300',
        locale: 'FR',
    }
}