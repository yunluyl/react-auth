var express = require('express');
var config = require('./config');
var auth = require('./auth');
var util = require('./util');
var router = express.Router();

var reportErr = util.reportErr;

//limit access rate if config.limitReqRate is true
router.use(function(req, res, next)
{
	if (config.limitReqRate)
	{
		util.reqLimit(req, res)
        .then(function()
        {
            next();
        })
        .catch(function(e)
        {
            return reportErr(res, e.message);
        });
	}
	else
	{
		next();
	}
});

//open api
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/reset', auth.resetPassword);
router.post('/change', auth.changePassword);
router.post('/activate', auth.activate);

//requires user session to continue
router.use(function(req, res, next)
{
	if (req.user)
	{
		next();
	}
	else
	{
		reportErr(res, 'notLoggedIn');
	}
});

//protected api
router.post('/logout', auth.logout);
router.post('/resend', auth.resendEmail);
router.get('/isactive', auth.isActive);

module.exports = router;