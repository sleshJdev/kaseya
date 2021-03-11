const http = require('http');
const { URL } = require('url');
const config = require('./config');

const authorizeRequest = require('./authorize-request');

http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const accept = (url.searchParams['accept'] || 'json').toLocaleLowerCase().trim();
    const reqAttrs = {
        method: req.method,
        path: req.url,
        headers: req.headers,
    };
    console.log(`Request ${JSON.stringify(reqAttrs)}`);
    const kaseyaRes = await authorizeRequest(reqAttrs);
    res.setHeader('Content-Type', `application/${accept}; charset=utf-8`);
    if (accept == 'jsonl') {
        res.write(kaseyaRes.map(it => JSON.stringify(it)).join('\n'));
    } else {
        res.write(JSON.stringify(kaseyaRes));
    }
    res.end();
}).listen(config.PROXY_PORT);