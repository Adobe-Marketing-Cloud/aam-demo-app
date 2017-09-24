
module.exports = function(app, config, logger, passport, passportOAuth2, request, session) {

    var oauth2config = {
        authorizationURL: config.get('api.host') + config.get('api.authorizationPath'),
        tokenURL: config.get('api.host') + config.get('api.tokenPath'),
        clientID: config.get('api.clientId'),
        clientSecret: config.get('api.clientSecret'),
        callbackURL: config.get('api.callbackUrl')
    };

    var sessionConfig = {
        secret: config.get('server.secret'),
        resave: true,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: true
        }
    };

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use('oauth2', new passportOAuth2(oauth2config,

        function(accessToken, refreshToken, user, done) {

            logger.info("login success");

            // asynchronous
            process.nextTick(function () {

                request( // get user profile from api
                    {
                        url: config.get('api.host') + config.get('api.basePath') + '/v1/users/self/?includeAllUserRoles=true',
                        headers: {'Authorization': 'Bearer ' + accessToken}
                    },
                    function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var profile = JSON.parse(body);
                            logger.info('token generated for "' + profile.username + '" uid:' + profile.uid);
                            // store token in session
                            user.profile = profile;
                            user.accessToken = accessToken;
                            user.refreshToken = refreshToken;
                            user.tokenType = 'AAM';
                            return done(error, user);
                        } else {
                            if (error) {
                                logger.error(error);
                            }
                            if (body) {
                                logger.error(body);
                            }
                            return done(null, false, {'message': 'Unable to get user profile.'});
                        }
                    }
                );
            });
        }
    ));

    // initialize passport and session for persistent login sessions
    app.use(session(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());

};
