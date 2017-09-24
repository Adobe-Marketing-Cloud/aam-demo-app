
module.exports = function(app, config, logger) {

    // console log all requests
    app.use(function(req, res, next) {
        try {
            if (req.url) {
                var msg = '';
                if (req.isAuthenticated() && req.user.profile) {
                    msg = msg + 'user:' + req.user.profile.username;
                } else {
                    msg += 'anonymous';
                }
                msg = msg + ' - ' + req.method + ' ' + req.url;
                logger.info(msg);
            }
        } catch (e) {
            logger.error(e);
        } finally {
            next();
        }
    });

};
