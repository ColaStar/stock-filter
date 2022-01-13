const { excludeDate } = require('../model/constant');

module.exports = {
    isExcludeDate: date => {
        let [, year, month, day] = date.match(/(\d+)-(\d+)-(\d+)/);
        year = parseInt(year, 10);
        month = parseInt(month, 10) - 1;
        day = parseInt(day, 10);
        return excludeDate[year] && excludeDate[year][month] && excludeDate[year][month].includes(day);
    }
}