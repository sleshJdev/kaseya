const env = (name) => {
    if (process.env[name]) {
        return process.env[name];
    }
    throw new Error(`Environment variable ${name} not found`);
}

module.exports = {
    PROXY_PORT: env('PROXY_PORT'),
    KASEYA_HOST: env('KASEYA_HOST'),
    KASEYA_USERNAME: env('KASEYA_USERNAME'),
    KASEYA_PASSWORD: env('KASEYA_PASSWORD')
};