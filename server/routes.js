
module.exports = function(app, config, logger, express, passport) {

    // middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect(web_root + 'login');
    }

    // start login flow
    app.get(web_root + 'login', passport.authenticate('oauth2'));

    // callback for oauth2 authorization code
    app.get(web_root + 'login/callback',
        passport.authenticate('oauth2', { failureRedirect: '/login/error' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        }
    );

    // login error
    app.get(web_root + 'login/error', function (req, res) {
        res.sendFile(app_root + '/web/login-error.html');
    });

    // logout url
    app.get(web_root + 'logout', function (req, res) {
        req.logout();
        //TODO: revoke access token
        res.sendFile(app_root + '/web/logout-success.html');
    });

    // check if user is authenticated for all requests
    app.all(web_root + '*', isLoggedIn, function (req, res, next) {
        next();
    });

    // home
    app.get(web_root, function (req, res) {
        res.sendFile(app_root + '/web/index.html');
    });

    // set the location for static files
    app.use(web_root, express.static(app_root + '/web', { maxAge: 0 }));

    // set the location for node_modules files
    app.use(web_root + 'node_modules', express.static(app_root + '/node_modules', { maxAge: 0 }));

};
