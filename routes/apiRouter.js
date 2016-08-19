var express = require('express');
var message = require('../config').message
var plan = require('../functions/plan');
var auth = require('../functions/auth');
var work = require('../functions/workspace');

var router = express.Router();

//open api
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/reset', auth.resetPassword);
router.get('/recaptcha', auth.checkCaptcha);

//requires user session to continue
router.use(function(req, res, next)
{
	if (req.user)
	{
		next();
	}
	else
	{
		res.status(400).send({err : message.notLoggedIn});
	}
});

//protected api
router.post('/getit', work.getit);
router.post('/createPlan', plan.createPlan);
router.post('/addup', plan.addup);
router.post('/removeup', plan.removeup);
router.get('/getPlan', plan.getPlan);
router.post('/change', auth.changePassword);
router.get('/logout', auth.logout);
router.get('/resend', auth.resendEmail);

module.exports = router;