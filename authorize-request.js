const requestToken = require('./request-token');
const config = require('./config');
const request = require('./request');

let apiToken = null;

module.exports = async (unauthReq) => {
    const authorizedRequest = (retried, headers) => (
        request({
            ...unauthReq,
            headers: {
                ...headers,
                accept: 'application/json; charset=utf-8',
                host: config.KASEYA_HOST
            },
            protocol: 'https:',
            host: config.KASEYA_HOST,
            hostname: config.KASEYA_HOST,
        }).then(res => {
            if (!apiToken || (res.ResponseCode === 401 && !retried)) {
                return requestToken().then(authInfo => {
                    apiToken = authInfo.Result.ApiToken
                    return authorizedRequest(true, {
                        ...headers,
                        Authorization: `Bearer ${apiToken}`
                    });
                });
            }
            return res;
        })
    );

    return apiToken
        ? await authorizedRequest(false, {
            ...unauthReq.headers,
            Authorization: `Bearer ${apiToken}`
        }).then(({ Result }) => (Result))
        : await authorizedRequest(false, unauthReq.headers)
            .then(({ Result }) => (Result))
};
