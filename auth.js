var passport = require('passport');
var config = require('./config');
var util = require('./util');
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');
var https = require('https');
var promise = require('bluebird');
var mongoose = promise.promisifyAll(require('mongoose'));
var bcrypt = promise.promisifyAll(require('bcryptjs'));
var transporter = promise.promisifyAll(nodemailer.createTransport(config.smtpConfig));

var User = mongoose.model('User');
var reportErr = util.reportErr;
var verifyCaptcha = util.verifyCaptcha;

////Authentication functions
//activation
module.exports.activate = function(req,res)
{
    User.findById(req.body._id).lean().execAsync()
    .then(function(user)
    {
        if (user)
        {
            if (user.hasOwnProperty('et'))
            {
                if (user.et > new Date().getTime())
                {
                    if (user.hasOwnProperty('tk'))
                    {
                        if (req.body.tk === user.tk)
                        {
                            User.updateAsync({_id : req.body._id}, {$unset : {tk : '', et : ''}})
                            .then(function(data)
                            {
                                if (data.nModified !== 1)
                                {
                                    throw new Error();
                                }
                                else
                                {
                                    transporter.sendMailAsync(new config.confirmEmail(req.body._id,'activationConfirm'))
                                    .then(function(info)
                                    {
                                        res.status(200).send({});
                                    })
                                    .catch(function(e)
                                    {
                                        reportErr(res, 'sendEmailErr');
                                    });
                                }
                            })
                            .catch(function(e)
                            {
                                return reportErr(res, 'editItem');
                            });
                        }
                        else
                        {
                            return reportErr(res, 'activationTokenNotMatch');
                        }
                    }
                    else
                    {
                        return reportErr(res, 'noActivationToken');
                    }
                }
                else
                {
                    return reportErr(res, 'activateTokenExpired');
                }
            }
            else
            {
                return reportErr(res, 'userHasActivated');
            }
        }
        else
        {
            return reportErr(res, 'userNotExist');
        }
    })
    .catch(function(e)
    {
        return reportErr(res, 'getItem');
    });
}

//signup
module.exports.signup = function(req, res)
{
    if (req.body._id.length > config.maxInputTextLength || req.body.dn.length > config.maxInputTextLength || req.body.pw.length > config.maxInputTextLength)
    {
        return reportErr(res, 'inputTextTooLong');
    }
    bcrypt.hashAsync(req.body.pw, config.saltRounds)
    .then(function(hash)
    {
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
                        return _signupAfterRecaptcha(req, res, hash);
                    }
                    else
                    {
                        return reportErr(res, 'recaptchaVerifyFailed');
                    }
                })
                .catch(function(e)
                {
                    return reportErr(res, 'recaptchaRequestErr');
                });
            }
            else
            {
                return reportErr(res, 'noRecapInBody');
            }
        }
        else
        {
            return _signupAfterRecaptcha(req, res, hash);
        }
    })
    .catch(function(e)
    {
        return reportErr(res, 'bcryptErr');
    });
}

function _signupAfterRecaptcha(req, res, hash)
{
    var token = uuid.v4();
    var expirationTime = new Date().getTime() + config.activationLinkExpireTime;
    User.createAsync(new User({
        _id : req.body._id,
        ph : hash,
        dn : req.body.dn,
        tk : token,
        et : expirationTime
    }))
    .then(function(data)
    {
        transporter.sendMailAsync(new config.activationEmail(req.body._id,token))
        .then(function(info)
        {
            req.login(data, function(err)
            {
                if (err)
                {
                    reportErr(res, 'signLoginFail');
                }
                else
                {
                    res.status(200).send({});
                }
            });
        })
        .catch(function(e)
        {
            reportErr(res, 'sendEmailErr');
        });
    })
    .catch(function(e)
    {
        if (e.code === 11000)
        {
            reportErr(res, 'userExist');
        }
        else
        {
            reportErr(res, 'putItem');
        }
    });
}

//login
module.exports.login = function(req, res, next) 
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
                        return reportErr(res, 'recaptchaVerifyFailed');
                    }
                })
                .catch(function(err)
                {
                    return reportErr(res, 'recaptchaRequestErr');
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
    User.findById(username).lean().execAsync()
    .then(function(user)
    {
        if (user)
        {
            bcrypt.compareAsync(password, user.ph)
            .then(function(comResult)
            {
                if (comResult)
                {
                    callback(null, user);
                }
                else
                {
                    callback(null, false, {message : 'wrongPassword'});
                }
            })
            .catch(function(e)
            {
                callback(e, null, {message : 'bcryptErr'});
            });
        }
        else
        {
            callback(null, false, {message : 'userNotExist'});
        }
    })
    .catch(function(e)
    {
        callback(e, null, {message : 'getItem'});
    });
}

module.exports.serializeUser = function(user, callback)
{
    callback(null, user._id);
}

//passport find user in database
module.exports.deserializeUser = function(id, callback)
{
    User.findById(id).lean().exec(function(err, user)
    {
        callback(err, user);
    });
}

//reset password
module.exports.resetPassword = function(req, res)
{
    if (req.body._id.length > config.maxInputTextLength)
    {
        return reportErr(res, 'inputTextTooLong');
    }
    User.findById(req.body._id).lean().execAsync()
    .then(function(user)
    {
        if (user)
        {
            if (user.hasOwnProperty('ep'))
            {
                renderErr(res, 'accountNotActive');
            }
            else
            {
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
                                return _resetAfterRecaptcha(req, res);
                            }
                            else
                            {
                                return reportErr(res, 'recaptchaVerifyFailed');
                            }
                        })
                        .catch(function(err)
                        {
                            return reportErr(res, 'recaptchaRequestErr');
                        });
                    }
                    else
                    {
                        return reportErr(res, 'noRecapInBody');
                    }
                }
                else
                {
                    return _resetAfterRecaptcha(req, res);
                }
            }
        }
        else
        {
            return reportErr(res, 'userNotExist');
        }
    })
    .catch(function(e)
    {
        return reportErr(res, 'getItem');
    });
}

function _resetAfterRecaptcha(req, res)
{
    var randomPassword = config.generatePassword();
    bcrypt.hashAsync(randomPassword, config.saltRounds)
    .then(function(hash)
    {
        var passwordExpirationTime = new Date().getTime() + config.tempPasswordExpireTime;
        User.updateAsync({_id : req.body._id}, {$set : {ph : hash, pe : passwordExpirationTime}})
        .then(function(data)
        {
            if (data.nModified !== 1)
            {
                throw new Error();
            }
            else
            {
                transporter.sendMailAsync(new config.resetEmail(req.body._id, randomPassword))
                .then(function(info)
                {
                    return res.status(200).send({});
                })
                .catch(function(e)
                {
                    return reportErr(res, 'resetEmailErr');
                });
            }
        })
        .catch(function(e)
        {
            return reportErr(res, 'putItem');
        });
    })
    .catch(function(e)
    {
        return reportErr(res, 'bcryptErr');
    });
}

//resend activation email
module.exports.resendEmail = function(req, res)
{
    if (req.user.hasOwnProperty('tk'))
    {
        var token = uuid.v4();
        var expirationTime = new Date().getTime() + config.activationLinkExpireTime;
        User.updateAsync({_id : req.user._id}, {$set : {tk : token, et : expirationTime}})
        .then(function(data)
        {
            if (data.nModified !== 1)
            {
                throw new Error();
            }
            else
            {
                transporter.sendMailAsync(new config.activationEmail(req.user._id, token))
                .then(function(info)
                {
                    res.status(200).send({});
                })
                .catch(function(e)
                {
                    return reportErr(res, 'sendEmailErr');
                });
            }
        })
        .catch(function(e)
        {
            return reportErr(res, 'putItem');
        });
    }
    else
    {
        return reportErr(res, 'userHasActivated');
    }
}

//change password
module.exports.changePassword = function(req, res)
{
    if (req.body.pw.length > config.maxInputTextLength || req.body.np.length > config.maxInputTextLength)
    {
        return reportErr(res, 'inputTextTooLong');
    }
    if (req.body._id)
    {
        User.findById(req.body._id).lean().execAsync()
        .then(function(user)
        {
            if (user)
            {
                req.user = user;
                _changeAfterFindUser(req, res);
            }
            else
            {
                return reportErr(res, 'userNotExist');
            }
        })
        .catch(function(e)
        {
            return reportErr(res, 'getItem');
        });
    }
    else if (req.user)
    {
        _changeAfterFindUser(req, res);
    }
    else
    {
        reportErr(res, 'notLoggedIn');
    }
}

function _changeAfterFindUser(req, res)
{
    const passwordExp = req.user.hasOwnProperty('pe');
    if (passwordExp)
    {
        if (req.user.pe <= new Date().getTime())
        {
            return reportErr(res, 'tempTokenExpired');
        }
    }

    bcrypt.compareAsync(req.body.pw, req.user.ph)
    .then(function(comResult)
    {
        if (comResult)
        {
            bcrypt.hashAsync(req.body.np, config.saltRounds)
            .then(function(hash)
            {
                let updateCondition = passwordExp ?
                                      {$set : {ph : hash}, $unset : {pe : ''}} :
                                      {$set : {ph : hash}};
                User.updateAsync({_id : req.user._id}, updateCondition)
                .then(function(data)
                {
                    if (data.nModified !== 1)
                    {
                        throw new Error();
                    }
                    else
                    {
                        transporter.sendMailAsync(new config.confirmEmail(req.user._id,'passwordChange'))
                        .then(function(info)
                        {
                            return res.status(200).send({});
                        })
                        .catch(function(e)
                        {
                            return reportErr(res, 'sendEmailErr');
                        });
                    }
                })
                .catch(function(e)
                {
                    return reportErr(res, 'editItem');
                });
            })
            .catch(function(e)
            {
                return reportErr(res, 'bcryptErr');
            });
        }
        else
        {
            return reportErr(res, 'wrongPassword');
        }
    })
    .catch(function(e)
    {
        return reportErr(res, 'bcryptErr');
    });
}

//logout
module.exports.logout = function(req, res)
{
    req.session.destroy(function(err)
    {
        if (err)
        {
            reportErr(res, 'destroySessionErr');
        }
        else
        {
            res.status(200).send({});
        }
    });
}

module.exports.isActive = function(req, res)
{
    if (req.user.hasOwnProperty('tk'))
    {
        res.status(200).send({active : false});
    }
    else
    {
        res.status(200).send({active : true});
    }
}