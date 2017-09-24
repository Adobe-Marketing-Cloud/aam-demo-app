
var express = require('express');
var app = express();
var config = require('config');
var path = require('path');
var passport = require('passport');
var passportOAuth2 = require('passport-oauth2');
var request = require('request');
var session = require('express-session');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({'timestamp': true})
    ]
});


global.app_root = path.resolve(__dirname);
global.web_root = '/';
global.port = config.has('server.port') ? config.get('server.port') : 9000;


// set up the authentication stuff
require(app_root + '/server/auth')(app, config, logger, passport, passportOAuth2, request, session);

// set up server side logging
require(app_root + '/server/logging')(app, config, logger);

// set up api proxy
require(app_root + '/server/api')(app, config, logger, request);

// set up routes
require(app_root + '/server/routes')(app, config, logger, express, passport);


app.listen(port, function () {
    logger.info('server started at http://localhost:' + port);
});
