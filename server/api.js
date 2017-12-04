function handleRequest({req, res, config, request}) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);;
    }

    var options = {};
    if (req.method === 'POST' || req.method === 'PUT') {
        options = {
            ...options,
            end: false
        };
    }

    return req
    .pipe(request(
        getPayloadWithBearer(req, config),
        (error) => onError(res, error)
    ), options)
    .pipe(res);
}

function getPayloadWithBearer(req, config) {
    const {
        query,
        method,
        user,
        body,
        params
    } = req;
    const authorizationHeader = `Bearer ${user.accessToken}`;

    const endpoint = generateEndpoint(params[0], user);
    const url = getUrl({
        host: config.get('api.host'),
        basePath: config.get('api.basePath'),
        endpoint
    });

    const payload = generatePayload({
        url,
        method,
        query,
        authorizationHeader,
        body
    });

    return payload;
}

function generateEndpoint(requestEndpoint, {tokenType, imsOrgId}) {
    if (tokenType === 'IMS') {
        //FIXME: add the orgId in api path if token type is IMS
        return `${requestEndpoint}org/${imsOrgId}`;
    }

    return requestEndpoint;
}

function getUrl({host, basePath, endpoint}) {
    return `${host}${basePath}/${endpoint}`;
}

function generatePayload({url, method, query, authorizationHeader, body}) {
    let payload = {
        url,
        method,
        qs: query,
        headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'application/json'
        }
    };

    if (method === 'POST' || method === 'PUT') {
        payload = addPostPutConfig(payload, body);
    }

    return payload;
}

function addPostPutConfig(payload, body) {
    let payloadWithPostPutConfig = {
        ...payload,
        body,
        json: true,
    };

    payloadWithPostPutConfig.headers['Content-Length'] = JSON.stringify(body).length;

    return payloadWithPostPutConfig;
}

function onError (res, error) {
    if (error) {
        console.error(error.message);
        //throw error;
        res.sendStatus(500);
    }
};

module.exports = (config, request) => (req, res) => handleRequest({req, res, config, request});
