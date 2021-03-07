import { createHash } from 'crypto';
import get from './get'

const sha256 = (message) => {
    return createHash('sha256')
        .update(message).digest('hex');
};

const sha1 = (message) => {
    return createHash('sha1')
        .update(message).digest('hex');
};

const generateClaim = () => {
    const username = process.env.USER_NAME
    const password = process.env.PASSWORD
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
}

export default async () => {
    return get('/auth', {
        Authorization: `Basic ${generateClaim()}`
    })
};