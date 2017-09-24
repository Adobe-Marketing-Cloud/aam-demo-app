
module.exports = function(app, config, logger, request) {

    // proxy all api calls to api server after adding bearer token
    app.all( '/api/*', function( req, res ) {

        var authorizationHeader = '';
        var endpoint = req.params[0];

        if (req.isAuthenticated()) {
            authorizationHeader = 'Bearer ' + req.user.accessToken;
            if (req.user.tokenType === 'IMS') {
                //FIXME: add the orgId in api path if token type is IMS
                endpoint = endpoint + 'org/' + user.imsOrgId;
            }
        } else {
            res.sendStatus(401);
            return;
        }

        var data = {
            url: config.get('api.host') + config.get('api.basePath') + '/' + endpoint,
            qs: req.query,
            method: req.method,
            headers: {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json'
            }
        };
        var options = {};
        if (req.method === 'POST' || req.method === 'PUT') {
            data.json = true;
            data.body = req.body;
            data.headers['Content-Length'] = JSON.stringify(req.body).length;
            options.end = false;
        }
        var callback = function(error, response, body){
            if (error) {
                console.error(error.message);
                //throw error;
                res.sendStatus(500);
            }
        };
        req.pipe( request(data, callback), options ).pipe( res );

    });

};


