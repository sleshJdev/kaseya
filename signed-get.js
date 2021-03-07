import get from './get'
import requestToken from './request-token'

let effectiveAuthInfo = null

export default async (path, headers) => {
    const request = (retried, effectiveHeaders) => (
        get(path, effectiveHeaders).then(res => {
            if (!effectiveAuthInfo || (res.ResponseCode === 401 && !retried)) {
                return requestToken().then(authInfo => {
                    effectiveAuthInfo = authInfo
                    return request(true, {
                        ...effectiveHeaders,
                        Authorization: `Bearer ${effectiveAuthInfo.Result.ApiToken}`
                    })
                })
            }
            return res
        })
    )
    if (effectiveAuthInfo) {
        const res_1 = await request(false, {
            ...headers,
            Authorization: `Bearer ${effectiveAuthInfo.Result.ApiToken}`
        });
        return res_1.Result;
    }
    const { Result } = await request(false, headers);
    return (Result);
}
