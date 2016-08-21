const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const authApi = require('./api-router');
const auth = require('./auth');
const configFile = require('./config');

module.exports = function(userConfig, app)
{
    for (var key in userConfig)
    {
        if (userConfig.hasOwnProperty(key))
        {
            configFile[key] = userConfig[key];
        }
    }
    mongoose.connect(process.env.PROD_MONGODB, {config : {autoIndex : true}});
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'mongodb connection error:'));
    db.once('open', function()
    {
        console.log('mongodb connected');
    });
    
    const store = new mongoStore(
    {
        mongooseConnection : db,
        autoRemove : 'native'
    });
    
    passport.use(new localStrategy({usernameField : '_id', passwordField : 'pw'}, auth.checkAuth));
    const sessionMiddleware = session(
    {
        secret: configFile.sessionSecret,
        saveUninitialized: false,
        resave: true,
        rolling: true,
        cookie: {secure: true, maxAge: configFile.userSessionMaxAge, domain: configFile.domain},
        store: store
    });

    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(auth.serializeUser);
    passport.deserializeUser(auth.deserializeUser);
    
    app.use(configFile.authPath, authApi);
};