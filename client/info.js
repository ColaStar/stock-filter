import { createBox } from './utils/dom';
export default function(data) {
    let { code, name } = data;
    let platform = 'sh';
    /^[03]/.test(code) && (platform = 'sz');

    let container = createBox('div', {
        class: 'js-container container',
        'data-code': code,
    });
    document.querySelector('.js-kline-box').append(container);

    const info = createBox('div', {
        class: 'info'
    });
    info.innerHTML = `
    <button class="del" data-type="del">del</button>
    <a target="_blank" href="https://finance.sina.com.cn/realstock/company/${platform}${code}/nc.shtml">${name} ${code}</a>`;
    container.append(info);

    const box = createBox('div', {
        class: 'box'
    });
    container.append(box);
    return box;
};