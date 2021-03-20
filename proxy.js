const http = require('http');
const { URL } = require('url');
const config = require('./config');
const { fetchAgents } = require('./index');
const authorizeRequest = require('./authorize-request');

const overallAgentsDataRouting = {
    '/assetmgmt/patch/status': (agentId) => (`/api/v1.0/assetmgmt/patch/${agentId}/status`),
    '/assetmgmt/patch/history': (agentId) => (`/api/v1.0/assetmgmt/patch/${agentId}/history`)
}

const handleRequest = async (reqInfo, res, resExt) => {
    console.log(`Request ${JSON.stringify(reqInfo)}`);
    const kaseyaRes = await authorizeRequest(reqInfo.attrs);
    const extend = (it) => ((resExt && { ...it, ...resExt }) || it);
    if (reqInfo.accept == 'jsonl') {
        res.write([].concat(kaseyaRes).map(it => {
            return JSON.stringify(extend(it));
        }).join('\n'));
    } else {
        res.write(JSON.stringify(extend(kaseyaRes)));
    }
}

const handleRequestOverAgents = async (req, res) => {
    const reqInfo = parseReqInfo(req);
    const agentUrlResolver = overallAgentsDataRouting[reqInfo.url.pathname];
    if (typeof agentUrlResolver !== 'function') {
        res.write(`Unknown URL ${url.pathname}`);
        res.statusCode(404);
        return Promise.reject();
    }
    const agents = await fetchAgents();
    return Promise.all(
        agents.map(async ({ AgentId }) => {
            return await handleRequest({
                ...reqInfo,
                attrs: {
                    ...reqInfo.attrs,
                    path: `${agentUrlResolver(AgentId)}${reqInfo.url.search}`
                }
            }, res, { AgentId });
        })
    )
}

const parseReqInfo = (req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return {
        url,
        accept: (url.searchParams.get('accept') || 'json').toLowerCase().trim(),
        attrs: {
            method: req.method,
            path: req.url,
            headers: req.headers
        }
    }
}

http.createServer(async (req, res) => {
    const reqInfo = parseReqInfo(req);
    res.setHeader('Content-Type', `application/${reqInfo.accept}; charset=utf-8`);
    if (overallAgentsDataRouting.hasOwnProperty(reqInfo.url.pathname)) {
        await handleRequestOverAgents(req, res);
    } else {
        await handleRequest(reqInfo, res);
    }
    res.end();
}).listen(config.PROXY_PORT);