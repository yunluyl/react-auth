var express = require('express');
var message = require('./config').message
var auth = require('./auth');

var router = express.Router();

//open api
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/reset', auth.resetPassword);
router.post('/change', auth.changePassword);

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
router.get('/logout', auth.logout);
router.get('/resend', auth.resendEmail);

module.exports = router;