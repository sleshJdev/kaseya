const http = require('http');
const config = require('./config');

const authorizeRequest = require('./authorize-request');

http.createServer(async (req, res) => {    
    const reqAttrs = {
        method: req.method,
        path: req.url,
        headers: req.headers,
    };
    console.log(`Request ${JSON.stringify(reqAttrs)}`);
    const kaseyaRes = await authorizeRequest(reqAttrs);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.write(JSON.stringify(kaseyaRes));
    res.end();
}).listen(config.PROXY_PORT);