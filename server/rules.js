const { dateTool, Compose, clone } = require('@tangyansoft/toolkit-common');
module.exports = {
    rule1: (context) => {
        let result = {};
        let { all } = context;
        Object.keys(all).forEach(key => {
            all[key].forEach(item => {
                let [info, list] = item;
                if (!/st/i.test(info.name)) {
                    let len = list.length;
                    let max = Math.max(...list.slice(0, len - 1).map(item => item.data[3]));
                    let { data } = list[len - 1];
                    let [close, open, now, high, low, volume, amount, deltaPercent, delta, pe] = data;
                    if (open * 1.02 < now) {
                        if (now - list[0].data[2] > 0 && max < now) {
                            result[key] = result[key] || [];
                            result[key].push([info, list]);
                        }
                    }
                }
            });
        });

        Object.keys(result).forEach(key => {
            result[key] = result[key].sort((a, b) => a[1][a[1].length - 1].data[2] - b[1][b[1].length - 1].data[2]);
        });
        return result;
    }
};