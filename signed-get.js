const get = require('./get');
const requestToken = require('./request-token');

let apiToken = null;

module.exports = async (path, headers) => {
    const request = (retried, effectiveHeaders) => (
        get(path, effectiveHeaders).then(res => {
            if (!apiToken || (res.ResponseCode === 401 && !retried)) {
                return requestToken().then(authInfo => {
                    apiToken = authInfo.Result.ApiToken
                    return request(true, {
                        ...effectiveHeaders,
                        Authorization: `Bearer ${apiToken}`
                    });
                });
            }
            return res;
        })
    );

    return apiToken
        ? await request(false, {
            ...headers,
            Authorization: `Bearer ${apiToken}`
        }).then(({ Result }) => (Result))
        : await request(false, headers)
            .then(({ Result }) => (Result))
};
