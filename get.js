const https = require('https');
const config = require('./config');

module.exports = async (path, headers) => {
    return new Promise((resolve, reject) => {
        https.get(`https://${config.KASEYA_HOST}/api/v1.0${path}`, {
            headers
        }, (response) => {
            let data = '';
            response.on('data', chunk => (data += chunk))
            response.on('end', () => (resolve(JSON.parse(data))))
            response.on('error', (err) => (reject(err)))
        })
    })
};