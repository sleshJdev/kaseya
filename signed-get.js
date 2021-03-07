const get = require('./get');
const requestToken = require('./request-token');

let effectiveAuthInfo = null;

module.exports = async (path, headers) => {
    const request = (retried, effectiveHeaders) => (
        get(path, effectiveHeaders).then(res => {
            if (!effectiveAuthInfo || (res.ResponseCode === 401 && !retried)) {
                return requestToken().then(authInfo => {
                    effectiveAuthInfo = authInfo
                    return request(true, {
                        ...effectiveHeaders,
                        Authorization: `Bearer ${effectiveAuthInfo.Result.ApiToken}`
                    });
                });
            }
            return res;
        })
    );

    return effectiveAuthInfo
        ? await request(false, {
            ...headers,
            Authorization: `Bearer ${effectiveAuthInfo.Result.ApiToken}`
        }).then(({ Result }) => (Result))
        : await request(false, headers)
            .then(({ Result }) => (Result))
};
