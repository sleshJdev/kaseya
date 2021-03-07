const kaseyaHost = process.env.KASEYA_HOST

if (!kaseyaHost) {
    throw new Error('KASEYA_HOST env variable should be specified')
}

export default (path, headers) => {
    return new Promise((resolve, reject) => {
        https.get(`https://${kaseyaHost}/api/v1.0${path}`, {
            headers
        }, (response) => {
            let data = '';
            response.on('data', chunk => (data += chunk))
            response.on('end', () => (resolve(JSON.parse(data))))
            response.on('error', (err) => (reject(err)))
        })
    })
};