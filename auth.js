var passport = require('passport');
var bcrypt = require('bcryptjs');
var config = require('./config');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(config.smtpConfig);
var uuid = require('node-uuid');
var querystring = require('querystring');
var https = require('https');
var promise = require('bluebird');
var mongoose = promise.promisifyAll(require('mongoose'));

var User = mongoose.model('User');
var ReqList = mongoose.model('ReqList');

//database access for recording number of requests
function reqLimit(req, res)
{
    return new promise(function(resolve, reject)
    {
        ReqList.find({$or : [{_id : req.body._id}, {_id : req.ip}]}).lean().execAsync()
        .then(function(data)
        {
            switch (data.length)
            {
                case 0:
                    ReqList.createAsync([{_id : req.body._id, fq : 1}, {_id : req.ip, fq : 1}])
                    .then(function(data)
                    {
                        resolve();
                    })
                    .catch(function(e)
                    {
                        reject(new Error('putItem'));
                    });
                    break;
                case 1:
                    if (data[0]._id === req.ip)
                    {
                        if (data[0].fq >= config.maxReqFromSameIP)
                        {
                            reject(new Error('tooManyRequestIP'));
                        }
                        promise.join(
                            ReqList.updateAsync({_id : req.ip}, {$inc : {fq : 1}}),
                            ReqList.createAsync({_id : req.body._id, fq : 1}),
                            function(data1, data2)
                            {
                                if (data1.nModified !== 1)
                                {
                                    throw new Error();
                                }
                                else
                                {
                                    resolve();
                                }
                            }
                        )
                        .catch(function(e)
                        {
                            reject(new Error('putItem'));
                        });
                    }
                    else if (data[0]._id === req.body._id)
                    {
                        if (data[0].fq >= config.maxReqFromSameUser)
                        {
                            reject(new Error('tooManyRequestUser'));
                        }
                        promise.join(
                            ReqList.updateAsync({_id : req.body._id}, {$inc : {fq : 1}}),
                            ReqList.createAsync({_id : req.ip, fq : 1}),
                            function(data1, data2)
                            {
                                if (data1.nModified !== 1)
                                {
                                    throw new Error();
                                }
                                else
                                {
                                    resolve();
                                }
                            }
                        )
                        .catch(function(e)
                        {
                            reject(new Error('putItem'));
                        });
                    }
                    else
                    {
                        reject(new Error('getItem'));
                    }
                    break;
                case 2:
                    if (data[0]._id === req.body._id && data[1]._id === req.ip)
                    {
                        if (data[0].fq >= config.maxReqFromSameUser)
                        {
                            reject(new Error('tooManyRequestUser'));
                        }
                        if (data[1].fq >= config.maxReqFromSameIP)
                        {
                            reject(new Error('tooManyRequestIP'));
                        }
                    }
                    else if (data[0]._id === req.ip && data[1]._id === req.body._id)
                    {
                        if (data[1].fq >= config.maxReqFromSameUser)
                        {
                            reject(new Error('tooManyRequestUser'));
                        }
                        if (data[0].fq >= config.maxReqFromSameIP)
                        {
                            reject(new Error('tooManyRequestIP'));
                        }
                    }
                    else
                    {
                        reject(new Error('editItem'));
                    }
                    ReqList.updateAsync({$or : [{_id : req.body._id},{_id : req.ip}]}, {$inc : {fq : 1}}, {multi : true})
                    .then(function(data)
                    {
                        if (data.nModified !== 2)
                        {
                            throw new Error();
                        }
                        else
                        {
                            resolve();
                        }
                    })
                    .catch(function(e)
                    {
                        reject(new Error('editItem'));
                    });
                    break;
                default:
                    reject(new Error('getItem'));
            }
        })
        .catch(function(e)
        {
            reject(new Error('getItem'));
        })
    });
}

////Utility functions
//centralized error report function
function reportErr(res, errorName)
{
    var message;
    var statusCode;
    if (typeof config.message[errorName] == 'undefined')
    {
        message = errorName;
        statusCode = 500;
    }
    else
    {
        message = config.message[errorName].msg;
        statusCode = config.message[errorName].status;
    }
    return res.status(statusCode).send({err : errorName, msg : message});
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

//login
module.exports.login = function(req, res, next) 
{
    if (config.limitReqRate)
    {
        reqLimit(req, res)
        .then(function()
        {
            loginLocal(req, res, next);
        })
        .catch(function(e)
        {
            return reportErr(res, e.message);
        });
    }
    else
    {
        loginLocal(req, res, next);
    }
}

//local login function
function loginLocal(req, res, next)
{
    if (req.body._id.length > config.maxInputTextLength || req.body.pw.length > config.maxInputTextLength)
    {
        return reportErr(res, 'inputTextTooLong');
    }
    passport.authenticate('local', function(err, user, info)
    {
        if (err)
        {
            return next(err);
        }
        if (!user)
        {
            return reportErr(res, info.message);
        }
        var hasPasswordExp;
        if (user.hasOwnProperty('pe'))
        {
            if (user.pe > new Date().getTime())
            {
                hasPasswordExp = true;
            }
            else
            {
                return reportErr(res, 'tempPasswordExpired');
            }
        }
        else
        {
            hasPasswordExp = false;
        }
        if (config.recaptcha)
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
                                pwExp : hasPasswordExp
                            });
                        });
                    }
                    else
                    {
                        return reportErr(res, 'captchaVerifyFailed');
                    }
                })
                .catch(function(err)
                {
                    return reportErr(res, 'captchaRequestErr');
                });
            }
            else
            {
                return reportErr(res, 'noRecapInBody');
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
                    pwExp : hasPasswordExp
                });
            });
        }
    })(req, res, next);
}

//passport local strategy -- check user identity
module.exports.passportLocal = function(username, password, callback)
{
    User.findById(username).lean().exec(function(err1, user)
    {
        if (err1)
        {
           callback(err1, null, {message : 'getItem'});
        }
        else
        {
            if (user)
            {
                bcrypt.compare(password, user.ph, function(err2,comResult)
                {
                    if (err2)
                    {
                        callback(err2, null, {message : 'bcryptErr'});
                    }
                    else
                    {
                        if (comResult)
                        {
                            callback(null, user);
                        }
                        else
                        {
                            callback(null, false, {message : 'wrongPassword'});
                        }
                    }
                });
            }
            else
            {
                callback(null, false, {message : 'userNotExist'});
            }
        }
    });
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