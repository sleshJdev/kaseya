const requestToken = require('./request-token');
const sleep = require('./sleep');

const tryRequestToken = async () => {
    const authInfo = await requestToken();
    if (authInfo && authInfo.Result && authInfo.Result.ApiToken) {
        return authInfo.Result.ApiToken;
    }
    await sleep(3000);
    return await tryRequestToken();
};

module.exports = tryRequestToken;