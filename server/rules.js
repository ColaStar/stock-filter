const { dateTool, Compose, clone } = require('@tangyansoft/toolkit-common');
module.exports = {
    rule1: (context) => {
        let result = {};
        let { all } = context;
        Object.keys(all).forEach(key => {
            all[key].forEach(item => {
                let { name, code, list } = item;
                let len = list.length;
                let max = Math.max(...list.slice(0, len - 1).map(item => item.data[3]));
                let { data } = list[len - 1];
                let [close, open, now, high, low, volume, amount, deltaPercent, delta, pe] = data;
                if (open * 1.02 < now) {
                    if (now - list[0].data[2] > 0 && max < now) {
                        result[key] = result[key] || [];
                        result[key].push([name, code, { now }, list]);
                    }
                }
            });
        });

        Object.keys(result).forEach(key => {
            result[key] = result[key].sort((a, b) => a[2].now - b[2].now);
        });
        return result;
    }
};