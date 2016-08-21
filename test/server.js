const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const reactAuth = require('../react-auth');

//app config
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public')));

const userConfig =
{
	sessionSecret : '654321',
	authPath : '/auth'
}

reactAuth(userConfig, app);

const options =
{
	key : fs.readFileSync('./certs/server.key'),
	cert : fs.readFileSync('./certs/server.cert')
};

const server = https.createServer(options, app);

server.listen(3000, function()
{
	console.log('Server started at https://localhost:3000');
});