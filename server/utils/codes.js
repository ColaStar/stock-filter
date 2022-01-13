'use strict';

const { isPlainObject, isError } = require('@tangyansoft/toolkit-common')

const codeList = [
    [200, 'success'],
    [403, 'forbidden'],
    [500, '服务器错误'],
    [1000, '参数错误']
];

const codes = new Map(codeList.map(item => [item[0], { code: item[0], msg: item[1] }]));

module.exports = {
    get: (code, data) => Object.assign({}, codes.get(code), {
        data: (() => {
            if (isPlainObject(data)) {
                return data;
            }
            if (isError(data)) {
                const alt = {};
                Object.getOwnPropertyNames(data).forEach(key => {
                    alt[key] = data[key];
                });
                return alt;
            }
            return data || null;
        })()
    })
};
