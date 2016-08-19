var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var toobusy = require('toobusy-js');
var helmet = require('helmet');
var compression = require('compression');
var apiRouter = require('./routes/apiRouter');
var auth = require('./functions/auth');
var iofunc = require('./functions/iofunc');
var config = require('./config');
import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext, match} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import routes from './browserRoutes.js';
import WithStylesContext from './src/WithStylesContext.jsx';
import appReducer from './src/redux/reducer.jsx';

//app config
var app = express();
app.use(compression());
app.use(helmet());
toobusy.maxLag(config.toobusyMaxLag);
toobusy.interval(config.toobusyCheckInterval);
app.use(function(req, res, next)
{
    if (toobusy())
    {
        res.status(503).send('Server is too busy, try again');
    }
    else
    {
        next();
    }
});
mongoose.connect(process.env.PROD_MONGODB, {config : {autoIndex : true}});
var db = mongoose.connection;
app.io = iofunc.io;
passport.use(new localStrategy({usernameField : '_id', passwordField : 'pw'}, auth.checkAuth));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.set('trust proxy', 1);
var sessionMiddleware = session(
{
    secret: 'kyocsf4',
    name: 'travel.id',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {secure: true, maxAge: config.userSessionMaxAge, domain: config.domain},
    store: new mongoStore({
        mongooseConnection : db,
        autoRemove : 'native'
    })
});
iofunc.io.use(function(socket, next)
{
    sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser);
iofunc.io.use(function(socket, next)
{
    if (socket.request.session.hasOwnProperty('passport') &&
        socket.request.session.passport.hasOwnProperty('user'))
    {
        next();
    }
    else
    {
        console.log("Couldn't find use session, socket IO access denied");
        next(new Error('Access denied, please login'));
    }
});
iofunc.io.on('connection', iofunc.onConnect);
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function()
{
    console.log('mongodb connected');
});

//paths
/*
app.get('/plans/:id', function(req, res) 
{
    if (req.user)
    {
        return res.render('workspace', {title : 'Travel Plan'});
    }
    return res.redirect(302, '/login?err=notLoggedIn');
});
*/
//app.get('/api/getPlans', plan.getPlan);

/*
app.get('/change', function(req, res)
{
    if (req.user)
    {
        return res.render('change', {title : 'Travel Plan', user : req.user});
    }
    return res.redirect(302, '/login?err=notLoggedIn');
});
*/

/*
app.get('/activate', auth.activate);
*/


//Go to plans if has user session
/*
app.use(function(req, res, next)
{
    if (req.user)
    {
        return res.redirect(302, '/plans');
    }
    next();
});
*/

app.use('/api', apiRouter);

//Continue if no user session
app.get('*', function(req, res)
{
    if (req.path === '/activate')
    {
        serverRender(req, res);
    }
    else if (req.user)
    {
        if (req.path === '/plans' ||
            req.path === '/change' ||
            req.path.match(/^\/plans\//))
        {
            serverRender(req, res);
        }
        else
        {
            res.redirect(302, '/plans');
        }
    }
    else
    {
        if (req.path === '/' ||
            req.path === '/login' ||
            req.path === '/signup' ||
            req.path === '/reset')
        {
            serverRender(req, res);
        }
        else if (req.path === '/plans' ||
                 req.path === '/change')
        {
            res.redirect(302, '/login');
        }
        else
        {
            res.redirect(302, '/');
        }
    }
});

function serverRender(req, res)
{
    match({routes, location : req.url}, (error, redirectLocation, renderProps) =>
    {
        if (error)
        {
            return res.status(500).send(error.message);
        }
        else if (redirectLocation)
        {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        else if (!renderProps)
        {
            return res.status(404).send('Not found');
        }
        else
        {
            let store = createStore(appReducer, applyMiddleware(thunkMiddleware));
            let css = [];
            let html = renderToString(
                <Provider store={store}>
                    <WithStylesContext onInsertCss={(styles) => css.push(styles._getCss())}>
                        <RouterContext {...renderProps} />
                    </WithStylesContext>
                </Provider>
            );
            Promise.all(renderProps.components.map(function(component)
            {
                if (component && component.fetchData)
                {
                    let data = undefined;
                    const idIdx = req.path.search(/[/][:]/);
                    if (idIdx !== -1)
                    {
                        data = {planId : req.path.slice(idIdx+2)};
                    }
                    return store.dispatch(component.fetchData(data, req.get('Cookie')));
                }
            }))
            .then(function()
            {
                res.type('html').render(
                'app',
                {
                    title : 'Travel Plan',
                    css : css.join(''),
                    state : store.getState(),
                    react : html
                });
            })
            .catch(function(err)
            {
                console.log(err);
            });
        }
    });
}

/*
app.get('/login', function(req, res)
{
    auth.checkCaptcha(req).then(function(da``ta)
    {
        if (data.length > 0)
        {
            if (req.query.err)
            {
                res.render('app', {title : 'Log In'});  //, message : config.message[req.query.err], captcha : true
            }
            else
            {
                res.render('app', {title : 'Log In'});  //, message : '', captcha : true
            }
        }
        else
        {
            if (req.query.err)
            {
                res.render('app', {title : 'Log In'}); //, message : config.message[req.query.err], captcha : false
            }
            else
            {
                res.render('app', {title : 'Log In'}); //, message : '', captcha : false
            }
        }
    }, function(err)
    {
        res.render('signup', {title : 'Sign Up'});  //, message : config.message['getItem'], captcha : true
    });
});
*/

/*
app.get('/signup', function(req, res)
{
    auth.checkCaptcha(req).then(function(data) {
        if (data.length > 0)
        {
            res.render('auth', {title : 'Sign Up'}); //, message : '', captcha : true
        }
        else
        {
            res.render('auth', {title : 'Sign Up'}); //, message : '', captcha : false
        }
    }, function(err)
    {
        res.render('auth', {title : 'Sign Up'}); //, message : config.message['getItem'], captcha : true
    });
});
*/

/*
app.get('/', function(req, res)
{
    res.render('index', {title : 'Travel Plan'});
});
*/
/*
app.get('/reset', function(req, res)
{
    auth.checkCaptcha(req).then(function(data) {
        if (data.length > 0)
        {
            res.render('auth', {title : 'Reset Password'}); //, message : '', captcha : true
        }
        else
        {
            res.render('auth', {title : 'Reset Password'}); //, message : '', captcha : false
        }
    }, function(err)
    {
        res.render('auth', {title : 'Reset Password'}); //, message : config.message['getItem'], captcha : true
    });
});
*/

/*
app.use(function(req, res, next)
{
    return res.redirect(302, '/');
});
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
