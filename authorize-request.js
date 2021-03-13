const config = require('./config');
const request = require('./request');
const tryRequestToken = require('./try-request-token');

let apiToken = null;

module.exports = async (unauthReq) => {
    const authorizedRequest = async (retried, headers) => {
        const res = await request({
            ...unauthReq,
            headers: {
                ...headers,
                accept: 'application/json; charset=utf-8',
                host: config.KASEYA_HOST
            },
            protocol: 'https:',
            host: config.KASEYA_HOST,
            hostname: config.KASEYA_HOST,
        });
        if (!apiToken || (res.ResponseCode === 401 && !retried)) {
            apiToken = await tryRequestToken();
            return await authorizedRequest(true, {
                ...headers,
                Authorization: `Bearer ${apiToken}`
            });
        }
        return Promise.resolve(res);
    };

    return apiToken
        ? await authorizedRequest(false, {
            ...unauthReq.headers,
            Authorization: `Bearer ${apiToken}`
        }).then(({ Result }) => (Result))
        : await authorizedRequest(false, unauthReq.headers)
            .then(({ Result }) => (Result))
};
