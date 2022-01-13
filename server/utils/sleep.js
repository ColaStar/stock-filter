const { list } = require('@tangyansoft/toolkit-common');

module.exports = (delay = [28, 30, 33, 35, 37]) => new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, Array.isArray(delay) ? list.random(delay, 1)[0] * 1000 : parseInt(delay, 10) * 1000);
});