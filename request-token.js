const crypto = require('crypto');
const get = require('./get');
const config = require('./config');

const sha256 = (message) => {
    return crypto.createHash('sha256')
        .update(message).digest('hex');
};

const sha1 = (message) => {
    return crypto.createHash('sha1')
        .update(message).digest('hex');
};

const generateClaim = () => {
    const username = config.KASEYA_USERNAME;
    const password = config.KASEYA_PASSWORD;
    const random = Math.random().toString().substr(2);
    const rawSHA256Hash = sha256(password);
    const coveredSHA256HashTemp = sha256(password + username);
    const coveredSHA256Hash = sha256(coveredSHA256HashTemp + random);
    const rawSHA1Hash = sha1(password);
    const coveredSHA1HashTemp = sha1(password + username);
    const coveredSHA1Hash = sha1(coveredSHA1HashTemp + random);
    return Buffer.from(
        'user=' + username
        + ',pass2=' + coveredSHA256Hash
        + ',pass1=' + coveredSHA1Hash
        + ',rpass2=' + rawSHA256Hash
        + ',rpass1=' + rawSHA1Hash
        + ',rand2=' + random
    ).toString('base64');
};

module.exports = async () => {
    return get('/auth', {
        Authorization: `Basic ${generateClaim()}`
    })
};