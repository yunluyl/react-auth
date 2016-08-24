var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id : String,
    ph : String,
    dn : String,
    pe : Date,
    tk : String,
    et : Date
}, {collection : 'usr'});

var reqlistSchema = new Schema({
    _id : String,
    fq : Number
}, {timestamps : true, collection : 'req'});

mongoose.model('User', userSchema);
mongoose.model('ReqList', reqlistSchema);

var consts = module.exports =
{
    saltRounds : 10,
    activationLinkExpireTime : 1800000,  //unit: ms
    emailSender : '"Travel Plan" <foodies@sandboxc8c4690cc28f4f6a9ce82305a3fcfbdf.mailgun.org>',
    tempPasswordExpireTime : 300000,  //unit: ms
    toobusyMaxLag : 70,
    toobusyCheckInterval : 500,
    maxReqFromSameIP : 6,
    maxReqFromSameUser : 6,
    userSessionMaxAge : 604800000,
    maxInputTextLength : 200,
    imageServerAddr : 'https://s3.amazonaws.com/travelplanserver',
    authPath : '/api',
    sessionSecret : '123456'
};

module.exports.message = {
    getItem :
    {
        status: 500,
        msg : 'ERROR: Internal error occured while getting data from the database'
    },
    activationDone :
    {
        status : 200,
        msg : 'Account has been successfully activated!'
    },
    editItem :
    {
        status : 500,
        msg : 'ERROR: Internal error occured while updating data in the database'
    }
    sendEmailErr :
    {
        status : 500,
        msg : 'Email did not send out because of email server error'
    }
    activationTokenNotMatch :
    {
        status : 400,
        msg : 'ERROR: Wrong activation token value'
    }
    noActivationToken :
    {
        status : 400,
        msg : 'ERROR: Internal error occured, no token value exist in the database'
    }
    activateTokenExpired :
    {
        status : 400,
        msg : 'ERROR: The activation link has expired, please resend activation email'
    }
    userHasActivated :
    {
        status : 400,
        msg : 'ERROR: User %s has been activated before'
    }
    userNotExist :
    {
        status : 400,
        msg : 'ERROR: User %s does not exist'
    }
    bcryptErr :
    {
        status : 500,
        msg : 'ERROR: Internal error occured while running bcrypt'
    }
    wrongPassword :
    {
        status : 400,
        msg : 'ERROR: Password is wrong'
    }
    userExist :
    {
        status : 400,
        msg : 'ERROR: User already exists'
    }
    putItem :
    {
        status : 500,
        msg : 'ERROR: Internal error occured while putting data to the database'
    }
    tempPasswordExpired :
    {
        status : 400,
        msg : 'ERROR: The temperary password has expired, please reset password again'
    }
    accountNotActive :
    {
        status : 400,
        msg : 'ERROR: The account is not activated, cannot reset password'
    }
    signLoginFail :
    {
        status : 500,
        msg : 'ERROR: Login in after signup failed'
    }
    destroySessionErr :
    {
        status : 500,
        msg : 'ERROR: Internal error occured while destroying the user session'
    }
    resetEmailErr :
    {
        status : 500,
        msg : 'ERROR: Internal error occured while sending temorary password'
    }
    notLoggedIn :
    {
        status : 400,
        msg : 'You are not logged in, please login'
    }
    passwordChanged :
    {
        status : 200,
        msg : 'Password has been changed successfully'
    }
    captchaVerifyFailed :
    {
        status : 400,
        msg : 'The non-bot checking failed'
    }
    captchaRequestErr :
    {
        status : 500,
        msg : 'Internal error occured whiling requesting for captcha verification'
    }
    tooManyRequestIP :
    {
        status : 400,
        msg : 'Requested too many times from the same IP, please wait'
    }
    tooManyRequestUser :
    {
        status : 400,
        msg : 'Requested too many times from the same user, please wait'
    }
    inputTextTooLong : 
    {
        status : 400,
        msg : 'The input text is too long'
    }
};


module.exports.smtpConfig = {
    host: 'smtp.mailgun.org',
    port: 2525,
    secure: false,
    requireTLS: true,
    connectionTimeout: 1000,
    greetingTimeout: 1000,
    auth: {
        user: 'postmaster@sandboxc8c4690cc28f4f6a9ce82305a3fcfbdf.mailgun.org',
        pass: '23898fa13f1882e0b11424081e9db139'
    }
};

module.exports.activationEmail = function(sendto,token) {
    this.from = consts.emailSender;
    this.to = sendto;
    this.subject = 'Account activation';
    this.text = 'https://travelplanserver.herokuapp.com/activate?_id='+sendto+'&tk='+token;
};

module.exports.resetEmail = function(sendto,tempPassword) {
    this.from = consts.emailSender;
    this.to = sendto;
    this.subject = 'Reset password';
    this.text = tempPassword;
};

module.exports.confirmEmail = function(sendto,category) {
    this.from = consts.emailSender;
    this.to = sendto;
    switch (category) {
        case 'activationConfirm':
            this.subject = 'Activation confirmation';
            this.text = 'Your account ' + sendto + ' has been successfully activated';
            break;
        case 'passwordChange':
            this.subject = 'Password change confirmation';
            this.text = 'Password has been changed for your account ' + sendto;
            break;
    }
}

module.exports.generatePassword = function() {
    var length = 10;
    var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var password = '';
            for (var i = 0, n = charset.length; i < length; ++i) {
                        password += charset.charAt(Math.floor(Math.random() * n));
                            }
                return password;
}
