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

var planSchema = new Schema({
    name : String,
    start : Date,
    end : Date,
    ct : {type : Date, default : Date.now},
    users : [String]
}, {collection : 'plan'});

var user2planSchema = new Schema({
    user : {type : String, index : true},
    plan : String
}, {collection : 'usr2pla'});

var pitemSchema = new Schema(
{
    plan : {type : String, index : true},
    title : String,
    loc : [Number],
    addr : String,
    city : String,
    state : String,
    zip : String,
    country : String,
    day : Number, //default 0
    time : Number, //in minutes, default 0
    len : Number,
    star : Boolean,
    trash : Boolean,
    added : Number,
    image : [String],
    desc : [String]
}, {timestamps : true, collection : 'pitem'});

mongoose.model('User', userSchema);
mongoose.model('ReqList', reqlistSchema);
mongoose.model('Plan', planSchema);
mongoose.model('Usr2pla', user2planSchema);
mongoose.model('Pitem', pitemSchema);

var consts = module.exports =
{
    saltRounds : 10,
    activationLinkExpireTime : 1800000,  //unit: ms
    emailSender : '"Travel Plan" <foodies@sandboxc8c4690cc28f4f6a9ce82305a3fcfbdf.mailgun.org>',
    tempPasswordExpireTime : 300000,  //unit: ms
    toobusyMaxLag : 70,
    toobusyCheckInterval : 500,
    maxReqBeforeCaptcha : 6,
    userSessionMaxAge : 604800000,
    maxInputTextLength : 200,
    imageServerAddr : 'https://s3.amazonaws.com/travelplanserver'
};

module.exports.message = {
    getItem:'ERROR: Internal error occured while getting data from the database',
    activationDone:'Account has been successfully activated!',
    editItem:'ERROR: Internal error occured while updating data in the database',
    sendEmailErr:'Email did not send out because of email server error',
    activationTokenNotMatch:'ERROR: Wrong activation token value',
    noActivationToken:'ERROR: Internal error occured, no token value exist in the database',
    activateTokenExpired:'ERROR: The activation link has expired, please resend activation email',
    userHasActivated:'ERROR: User %s has been activated before',
    userNotExist:'ERROR: User %s does not exist',
    bcryptErr:'ERROR: Internal error occured while running bcrypt',
    wrongPassword:'ERROR: Password is wrong',
    userExist:'ERROR: User already exists',
    putItem:'ERROR: Internal error occured while putting data to the database',
    tempPasswordExpired:'ERROR: The temperary password has expired, please reset password again',
    accountNotActive:'ERROR: The account is not activated, cannot reset password',
    signLoginFail:'ERROR: Login in after signup failed',
    destroySessionErr:'ERROR: Internal error occured while destroying the user session',
    resetEmailErr:'ERROR: Internal error occured while sending temorary password',
    notLoggedIn:'You are not logged in, please login',
    passwordChanged:'Password has been changed successfully',
    captchaVerifyFailed: 'The non-bot checking failed',
    captchaRequestErr: 'Internal error occured whiling requesting for captcha verification',
    tooManyAccess: 'Accessed too many times, please check the non-bot test',
    inputTextTooLong: 'The input text is too long',
    domain: 'travelplanserver.herokuapp.com',
    notPlanOwner: 'ERROR: You are not authorized to add users to the plan',
    u2pExist: 'ERROR: This user is already linked to this plan',
    removePlanNotExist: 'ERROR: The plan you try to remove does not exist',
    removePlanTooMany: 'ERROR: Removed more than one plan',
    editPlanNotExist: 'ERROR: The plan you try to edit does not exist',
    noChangeInEditPlan: 'ERROR: No value is changed in edit plan',
    noPlanforLink: 'ERROR: No plan exists in the database for the user to plan link'
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
