export function $(selector) {
    return document.querySelector(selector);
};

export function $$(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
};

export const createBox = (tag, options = {}) => {
    let box = document.createElement(tag || 'section');
    Object.keys(options).forEach((key) => {
        box.setAttribute(key, options[key]);
    });
    return box;
};

export const tpl = (template, data) => {
    const regex = /{{(.*?)}}/g;
    return template.replace(regex, (_, key) => {
        let result = data;
        for (const property of key.split('.')) {
            result = result ? result[property] : '';
        }
        return String(result);
    });
};

export default {
    $,
    $$
};