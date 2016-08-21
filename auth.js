var passport = require('passport');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');
var config = require('./config');
var transporter = nodemailer.createTransport(config.smtpConfig);
var mongoose = require('mongoose');
var User = mongoose.model('User');
var async = require('async');
var querystring = require('querystring');
var https = require('https');
var promise = require('bluebird');
var ReqList = mongoose.model('ReqList');

////Utility functions
//centralized error report function
function renderErr(req, res, errorMsg)
{
    var message = config.message[errorMsg];
    if (!message)
    {
        message = errorMsg;
    }
    getReq(req)
    .then(function(data)
    {
        if (data.length > 0)
        {
            res.status(400).send({msg : message, recap : true});
        }
        else
        {
            res.status(400).send({msg : message, recap : false});
        }
    })
    .catch(function(err)
    {
        res.status(500).send({msg : err.message, recap : true});
    });
}

//verify the recaptcha value submitted by the user is correct
function verifyCaptcha(req)
{
    return new promise(function(resolve, reject)
    {
        var post_data = querystring.stringify
        ({
            secret : process.env.RECAPTCHA_KEY,
            response : req.body['g-recaptcha-response'],
            remoteip : req.ip
        });
        var post_options =
        {
            host : 'www.google.com',
            path : '/recaptcha/api/siteverify',
            method : 'POST',
            headers :
            {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(post_data)
            }
        }
        var post_req = https.request(post_options, function(res)
        {
            res.setEncoding('utf8');
            res.on('data', function(chunk)
            {
                resolve(chunk);
            });
            res.on('error', function(error)
            {
                reject(new Error(error));
            });
        });
        post_req.write(post_data);
        post_req.end();
    });
}

////Authentication functions
//render activate page
module.exports.activate = function(req,res) {
    User.findById(req.query._id).lean().exec(function(err1, data1)
    {
        if (err1) {
            res.render('notification',{title: 'Travel plan account activation', message : config.message['getItem']});
        }
        else {
            if (data1) {
                if (data1.hasOwnProperty('et')) {
                    if (data1.et > new Date().getTime()) {
                        if (data1.hasOwnProperty('tk')) {
                            if (req.query.tk === data1.tk) {
                                User.update({_id : req.query._id}, {$unset : {tk : '', et : ''}}, function(err2, data2)
                                {
                                    if (err2 || data2.nModified !== 1) {
                                        res.render('notification',{title: 'Travel plan account activation', message: config.message['editItem']});
                                    }
                                    else {
                                        transporter.sendMail(new config.confirmEmail(req.query._id,'activationConfirm'), function(err3,info) {
                                            if (err3) {
                                                res.render('notification',{title: 'Travel plan account activation', message: config.message['sendEmailErr']}); //activation finished, but send email failed
                                            }
                                            else {
                                                res.render('notification',{title: 'Travel plan account activation', message : config.message['activationDone']});
                                            }
                                        })
                                    }
                                });
                            }
                            else {
                                res.render('notification',{title: 'Travel plan account activation', message : config.message['activationTokenNotMatch']});
                            }
                        }
                        else {
                            res.render('notification',{title: 'Travel plan account activation', message : config.message['noActivationToken']});
                        }
                    }
                    else {
                        res.render('notification',{title: 'Travel plan account activation', message : config.message['activateTokenExpired']});
                    }
                }
                else {
                    res.render('notification',{title: 'Travel plan account activation', message : config.message['userHasActivated'].replace(/[%][s]/,req.query._id)});
                }
            }
            else {
                res.render('notification',{title: 'Travel plan account activation', message : config.message['userNotExist'].replace(/[%][s]/,req.query._id)});
            }
        }
    });
}

//signup wrapper
module.exports.signup = function(req, res)
{
    if (req.body._id.length > config.maxInputTextLength || req.body.dn.length > config.maxInputTextLength || req.body.pw.length > config.maxInputTextLength)
    {
        return renderErr(req, res, config.message.inputTextTooLong);
    }
    reqLimit(req, res, renderErr, signup);
}

//signup function
function signup(req, res, captcha)
{
    bcrypt.hash(req.body.pw, config.saltRounds, function(err1, hash) {
        if (err1)
        {
            renderErr(req, res, config.message.bcryptErr);
        }
        else
        {
            if (captcha)
            {
                if (req.body['g-recaptcha-response'])
                {
                    verifyCaptcha(req)
                    .then(function(chunk)
                    {
                        var result = JSON.parse(chunk);
                        if (result.success)
                        {
                            var token = uuid.v4();
                            var expirationTime = new Date().getTime() + config.activationLinkExpireTime;
                            User.create(new User({
                                _id : req.body._id,
                                ph : hash,
                                dn : req.body.dn,
                                tk : token,
                                et : expirationTime
                            }), function(err2, data2)
                            {
                                if (err2)
                                {
                                    if (err2.code === 11000)
                                    {
                                        renderErr(req, res, config.message.userExist);
                                    }
                                    else
                                    {
                                        renderErr(req, res, config.message.putItem);
                                    }
                                }
                                else
                                {
                                    transporter.sendMail(new config.activationEmail(req.body._id,token), function(err3,info)
                                    {
                                        req.login(data2, function(err4)
                                        {
                                            if (err4)
                                            {
                                                res.status(200).send(
                                                {
                                                    redirect : '/login',
                                                    msg : config.message.signLoginFail
                                                });
                                                //res.redirect(302, '/login?err=signLoginFail');
                                            }
                                            else
                                            {
                                                res.status(200).send(
                                                {
                                                    redirect : '/plans'
                                                });
                                                //res.redirect(302, '/plans');
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        else
                        {
                            return renderErr(req, res, config.message.captchaVerifyFailed);
                        }
                    })
                    .catch(function(err)
                    {
                        return renderErr(req, res, config.message.captchaRequestErr);
                    });
                }
                else
                {
                    return renderErr(req, res, config.message.tooManyAccess);
                }
            }
            else
            {
                var token = uuid.v4();
                var expirationTime = new Date().getTime() + config.activationLinkExpireTime;
                User.create(new User({
                    _id : req.body._id,
                    ph : hash,
                    dn : req.body.dn,
                    tk : token,
                    et : expirationTime
                }), function(err2, data2)
                {
                    if (err2)
                    {
                        if (err2.code === 11000)
                        {
                            renderErr(req, res, config.message.userExist);
                        }
                        else
                        {
                            renderErr(req, res, config.message.putItem);
                        }
                    }
                    else
                    {
                        transporter.sendMail(new config.activationEmail(req.body._id,token), function(err3,info)
                        {
                            req.login(data2, function(err4)
                            {
                                if (err4)
                                {
                                    res.status(200).send(
                                    {
                                        redirect : '/login',
                                        msg : config.message.signLoginFail
                                    });
                                    //res.redirect(302, '/login?err=signLoginFail');
                                }
                                else
                                {
                                    res.status(200).send(
                                    {
                                        redirect : '/plans'
                                    });
                                    //res.redirect(302, '/plans');
                                }
                            });
                        });
                    }
                });
            }
        }
    });
}

//login wrapper
module.exports.login = function(req, res, next) 
{
    if (req.body._id.length > config.maxInputTextLength || req.body.pw.length > config.maxInputTextLength)
    {
        return renderErr(req, res, config.message.inputTextTooLong);
    }
    reqLimit(req, res, renderErr, login, next);
}

//passport local strategy -- check user identity
module.exports.checkAuth = function(username, password, callback)
{
    User.findById(username).lean().exec(function(err1, user)
    {
        if (err1)
        {
           callback(err1, null, {message : config.message.getItem});
        }
        else
        {
            if (user)
            {
                bcrypt.compare(password, user.ph, function(err2,comResult)
                {
                    if (err2)
                    {
                        callback(err2, null, {message : config.message.bcryptErr});
                    }
                    else
                    {
                        if (comResult)
                        {
                            callback(null, user);
                        }
                        else
                        {
                            callback(null, false, {message : config.message.wrongPassword});
                        }
                    }
                });
            }
            else
            {
                callback(null, false, {message : config.message.userNotExist.replace(/[%][s]/, username)});
            }
        }
    });
}

//login use passport local strategy
function login(req, res, captcha, next)
{
    passport.authenticate('local', function(err, user, info)
    {
        if (err)
        {
            return next(err);
        }
        if (!user)
        {
            return renderErr(req, res, info.message);
        }
        var pathAfterLogin = '';
        if (user.hasOwnProperty('pe'))
        {
            if (user.pe > new Date().getTime())
            {
                pathAfterLogin = '/change';
            }
            else
            {
                return renderErr(req, res, config.message.tempPasswordExpired);
            }
        }
        else
        {
            pathAfterLogin = '/plans';
        }
        if (captcha)
        {
            if (req.body['g-recaptcha-response'])
            {
                verifyCaptcha(req)
                .then(function(chunk)
                {
                    var result = JSON.parse(chunk);
                    if (result.success)
                    {
                        req.login(user, function(err1)
                        {
                            if (err1)
                            {
                                return next(err1);
                            }
                            return res.status(200).send(
                            {
                                redirect : pathAfterLogin
                            });
                            //return res.redirect(302, pathAfterLogin);
                        });
                    }
                    else
                    {
                        return renderErr(req, res, config.message.captchaVerifyFailed);
                    }
                })
                .catch(function(err)
                {
                    return renderErr(req, res, config.message.captchaRequestErr);
                });
            }
            else
            {
                return renderErr(req, res, config.message.tooManyAccess);
            }
        }
        else
        {
            req.login(user, function(err1)
            {
                if (err1)
                {
                    return next(err1);
                }
                return res.status(200).send(
                {
                    redirect : pathAfterLogin
                });
                //return res.redirect(302, pathAfterLogin);
            });
        }
    })(req, res, next);
}

module.exports.serializeUser = function(user, callback)
{
    callback(null, user._id);
}

//tell passport how to find user in database
module.exports.deserializeUser = function(id, callback)
{
    User.findById(id).lean().exec(function(err, user)
    {
        callback(err, user);
    });
}

//reset password wrapper to limit the number of reset requests
module.exports.resetPassword = function(req, res)
{
    if (req.body._id.length > config.maxInputTextLength)
    {
        return renderErr(req, res, config.message.inputTextTooLong);
    }
    reqLimit(req, res, renderErr, resetPassword);
}

//api function serves reset password requests
function resetPassword(req, res, captcha)
{
    User.findById(req.body._id).lean().exec(function(err1, user)
    {
        if (err1)
        {
            renderErr(req, res, config.message.getItem);
        }
        else {
            if (user)
            {
                if (user.hasOwnProperty('ep'))
                {
                    renderErr(req, res, config.message.accountNotActive);
                }
                else
                {
                    if (captcha)
                    {
                        if (req.body['g-recaptcha-response'])
                        {
                            verifyCaptcha(req)
                            .then(function(chunk)
                            {
                                var result = JSON.parse(chunk);
                                if (result.success)
                                {
                                    var randomPassword = config.generatePassword();
                                    bcrypt.hash(randomPassword, config.saltRounds, function(err2, hash)
                                    {
                                        if (err2)
                                        {
                                            renderErr(req, res, config.message.bcryptErr);
                                        }
                                        else
                                        {
                                            var passwordExpirationTime = new Date().getTime() + config.tempPasswordExpireTime;
                                            User.update({_id : req.body._id}, {$set : {ph : hash, pe : passwordExpirationTime}}, function(err3, data3)
                                            {
                                                if (err3 || data3.nModified !== 1)
                                                {
                                                    renderErr(req, res, config.message.putItem);
                                                }
                                                else
                                                {
                                                    transporter.sendMail(new config.resetEmail(req.body._id,randomPassword), function(err4,info)
                                                    {
                                                        if (err4)
                                                        {
                                                            renderErr(req, res, config.message.resetEmailErr);
                                                        }
                                                        else
                                                        {
                                                            res.status(200).send(
                                                            {
                                                                redirect : '/login'
                                                            });
                                                            //res.redirect(302, '/login'); //password reset sccessful
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else
                                {
                                    return renderErr(req, res, config.message.captchaVerifyFailed);
                                }
                            })
                            .catch(function(err)
                            {
                                return renderErr(req, res, config.message.captchaRequestErr);
                            });
                        }
                        else
                        {
                            return renderErr(req, res, config.message.tooManyAccess);
                        }
                    }
                    else
                    {
                        var randomPassword = config.generatePassword();
                        bcrypt.hash(randomPassword, config.saltRounds, function(err2, hash)
                        {
                            if (err2)
                            {
                                renderErr(req, res, config.message.bcryptErr);
                            }
                            else
                            {
                                var passwordExpirationTime = new Date().getTime() + config.tempPasswordExpireTime;
                                User.update({_id : req.body._id}, {$set : {ph : hash, pe : passwordExpirationTime}}, function(err3, data3)
                                {
                                    if (err3 || data3.nModified !== 1)
                                    {
                                        renderErr(req, res, config.message.putItem);
                                    }
                                    else
                                    {
                                        transporter.sendMail(new config.resetEmail(req.body._id,randomPassword), function(err4,info)
                                        {
                                            if (err4)
                                            {
                                                renderErr(req, res, config.message.resetEmailErr);
                                            }
                                            else
                                            {
                                                res.status(200).send(
                                                {
                                                    redirect : '/login'
                                                });
                                                //res.redirect(302, '/login'); //password reset sccessful
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else
            {
                renderErr(req, res, config.message.userNotExist.replace(/[%][s]/,req.body._id));
            }
        }
    });
}

//resend activation email
module.exports.resendEmail = function(req, res)
{
    if (req.user)
    {
        if (req.user.hasOwnProperty('tk'))
        {
            var token = uuid.v4();
            var expirationTime = new Date().getTime() + config.activationLinkExpireTime;
            User.update({_id : req.user._id}, {$set : {tk : token, et : expirationTime}}, function(err1, data1)
            {
                if (err1 || data1.nModified !== 1)
                {
                    res.status(500).send(
                    {
                        msg : config.message.putItem
                    });
                    //res.redirect(302, '/plans?resendMsg=putItem');
                }
                else
                {
                    transporter.sendMail(new config.activationEmail(req.user._id, token), function(err2, info)
                    {
                        if (err2)
                        {
                            res.status(400).send(
                            {
                                msg : config.message.sendEmailErr
                            });
                            //res.redirect(302, '/plans?resendMsg=sendEmailErr');
                        }
                        else
                        {
                            res.status(200).send({});
                            //res.redirect(302, '/plans?resendMsg=resendEmail');
                        }
                    });
                }
            });
        }
        else {
            res.status(400).send(
            {
                msg : config.message.userHasActivated
            });
            //res.redirect(302, '/plans?resendMsg=userHasActivated');
        }
    }
    else {
        res.status(400).send(
        {
            redirect : '/login',
            msg : config.message.notLoggedIn
        });
        //res.redirect(302, '/login?err=notLoggedIn'); //redirect to user login
    }
}

//change password
module.exports.changePassword = function(req, res)
{
    if (req.body.pw.length > config.maxInputTextLength || req.body.np.length > config.maxInputTextLength)
    {
        return renderErr(req, res, config.message.inputTextTooLong);
    }
    if (req.user)
    {
        if (req.user.hasOwnProperty('pe'))
        {
            bcrypt.hash(req.body.np, config.saltRounds, function(err1, hash)
            {
                if (err1)
                {
                    res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.bcryptErr});
                }
                else
                {
                    User.update({_id : req.user._id}, {$set : {ph : hash}, $unset : {pe : ''}}, function(err2, data2)
                    {
                        if (err2 || data2.nModified !== 1)
                        {
                            res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.editItem});
                        }
                        else
                        {
                            transporter.sendMail(new config.confirmEmail(req.user._id,'passwordChange'), function(err3,info)
                            {
                                res.render('notification', {title : 'Travel Plan', message : config.message.passwordChanged});
                            });
                        }
                    });
                }
            });
        }
        else
        {
            User.findById(req.user._id).lean().exec(function(err1, user)
            {
                if (err1)
                {
                    res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.getItem});
                }
                else
                {
                    if (user)
                    {
                        bcrypt.compare(req.body.pw, user.ph, function(err2, comResult2)
                        {
                            if (comResult2)
                            {
                                bcrypt.hash(req.body.np, config.saltRounds, function(err3, hash)
                                {
                                    if (err3)
                                    {
                                        res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.bcryptErr});
                                    }
                                    else
                                    {
                                        User.update({_id : req.user._id}, {$set : {ph : hash}}, function(err4, data4)
                                        {
                                            if (err4 || data4.nModified !== 1)
                                            {
                                                res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.editItem});
                                            }
                                            else
                                            {
                                                transporter.sendMail(new config.confirmEmail(req.user._id,'passwordChange'), function(err5,info)
                                                {
                                                    res.render('notification', {title : 'Travel Plan', message : config.message.passwordChanged});
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else
                            {
                                res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.wrongPassword});
                            }
                        });
                    }
                    else
                    {
                        res.render('change', {title : 'Travel Plan', user : req.user, message : config.message.userNotExist.replace(/[%][s]/,req.user._id)});
                    }
                }
            });
        }
    }
    else
    {
        res.status(400).send(
        {
            redirect : '/login',
            msg : config.message.notLoggedIn
        });
        //res.redirect('/login?err=notLoggedIn'); //redirect to user login
    }
}

//logout
module.exports.logout = function(req, res)
{
    req.session.destroy(function(err1)
    {
        if (err1) 
        {
            res.status(500).send(
            {
                err : 'destroySessionErr',
                msg : config.message.destroySessionErr
            });
        }
        else
        {
            res.status(200).send();
        }
    });
}