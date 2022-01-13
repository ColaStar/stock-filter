export default function closest(ele, selector, containerSelector) {
    const matchesSelector = ele.matches || ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.msMatchesSelector;
    let element = ele;
    while (element && element.removeChild) {
        if (matchesSelector.call(element, selector)) {
            return element;
        }
        element = element.parentElement;
        if (containerSelector && element && matchesSelector.call(element, containerSelector)) {
            return null;
        }
        if (element && element.tagName && element.tagName.toLowerCase() === 'html') {
            return null;
        }
    }
    return null;
};