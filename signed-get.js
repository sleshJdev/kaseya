const get = require('./get');
const tryRequestToken = require('./try-request-token');

let apiToken = null;

module.exports = async (path, headers) => {
    const request = async (retried, effectiveHeaders) => {
        const res = await get(path, effectiveHeaders);
        if (!apiToken || (res.ResponseCode === 401 && !retried)) {
            apiToken = await tryRequestToken();
            return request(true, {
                ...effectiveHeaders,
                Authorization: `Bearer ${apiToken}`
            });
        }
        return res;
    };

    return apiToken
        ? await request(false, {
            ...headers,
            Authorization: `Bearer ${apiToken}`
        }).then(({ Result }) => (Result))
        : await request(false, headers)
            .then(({ Result }) => (Result))
};
