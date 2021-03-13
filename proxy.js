const http = require('http');
const { URL } = require('url');
const config = require('./config');
const { fetchAgents } = require('./index');

const authorizeRequest = require('./authorize-request');

const overallAgentsDataRouting = {
    '/assetmgmt/patch/status': (agentId) => (`/api/v1.0/assetmgmt/patch/${agentId}/status`),
    '/assetmgmt/patch/history': (agentId) => (`/api/v1.0/assetmgmt/patch/${agentId}/history`)
}

const handleRequest = async (reqAttrs, res) => {
    console.log(`Request ${JSON.stringify(reqAttrs)}`);
    const kaseyaRes = await authorizeRequest(reqAttrs);
    if (reqAttrs.accept == 'jsonl') {
        if (Array.isArray(kaseyaRes)) {
            res.write(kaseyaRes.map(it => JSON.stringify(it)).join('\n'));
        } else {
            res.write(JSON.stringify(kaseyaRes));
        }
    } else {
        res.write(JSON.stringify(kaseyaRes));
    }
}

const handleRequestOverAgents = async (req, res, url, accept) => {
    const agentUrlResolver = overallAgentsDataRouting[url.pathname];
    if (typeof agentUrlResolver !== 'function') {
        res.write(`Unknown URL ${url.pathname}`);
        res.statusCode(404);
        return Promise.reject();
    }
    const agents = await fetchAgents();
    return Promise.all(
        agents.map(async ({ AgentId }) => {
            return await handleRequest({
                method: req.method,
                headers: req.headers,
                path: `${agentUrlResolver(AgentId)}${url.search}`,
                accept,
            }, res);
        })
    )
}

http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const accept = (url.searchParams.get('accept') || 'json').toLocaleLowerCase().trim();
    const reqAttrs = {
        method: req.method,
        path: req.url,
        headers: req.headers
    };
    res.setHeader('Content-Type', `application/${accept}; charset=utf-8`);
    if (overallAgentsDataRouting.hasOwnProperty(url.pathname)) {
        await handleRequestOverAgents(req, res, url, accept);
    } else {
        await handleRequest(reqAttrs);
    }
    res.end();
}).listen(config.PROXY_PORT);