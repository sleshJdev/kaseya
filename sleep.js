module.exports = (millis) => {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
}