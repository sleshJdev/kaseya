const https = require('https');

module.exports = async (request) => {
    return new Promise((resolve, reject) => {
        https.request(request, (response) => {
            let data = '';
            response.on('data', chunk => (data += chunk))
            response.on('end', () => (resolve(JSON.parse(data))))
            response.on('error', (err) => (reject(err)))
        }).end();
    });
};