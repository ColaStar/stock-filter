const { dateTool } = require('@tangyansoft/toolkit-common');
const { excludeDate } = require('../model/constant');
const isExcludeDate = date => {
    let [, year, month, day] = date.match(/(\d+)-(\d+)-(\d+)/);
    year = parseInt(year, 10);
    month = parseInt(month, 10) - 1;
    day = parseInt(day, 10);
    return excludeDate[year] && excludeDate[year][month] && excludeDate[year][month].includes(day);
};

module.exports = {
    isExcludeDate,
    getAllTradingDay: year => {
        let weeks = dateTool.getAllWeek(year);
        let result = [];
        for (let m = 0; m < weeks.length; m++) {
            let month = weeks[m];
            for (let w = 0; w < month.length; w++) {
                let week = month[w].filter(day => day);
                for (let d = 0; d < week.length; d++) {
                    let date = week[d].map((item, idx) => {
                        if (idx && item < 10) {
                            return '0' + item;
                        }
                        return item;
                    }).join('-');
                    !isExcludeDate(date) && result.push(date);
                }
            }
        }
        return result;
    }
}