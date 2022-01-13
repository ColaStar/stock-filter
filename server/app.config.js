'use strict'

const isDev = process.env.NODE_ENV === 'development';
const isPreview = process.env.NODE_ENV === 'preview';

module.exports = {
    port: isDev || isPreview ? 3636 : 3000,
    apis: (() =>
        [
            ['userInfo', 'http://tangyan.dev/api/userInfo'],
        ].reduce((result, item) => {
            result[item[0]] = !isDev ? item[1] : item[2] || item[1]
            return result
        }, {}))(),
}
