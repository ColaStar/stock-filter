const path = require('path');
const fs = require('fs');
const { dateTool } = require('@tangyansoft/toolkit-common');
const { download, input } = require('./utils/data');
const subset = require('./model/subset');
const sleep = require('./utils/sleep');
const p = require('./utils/puppeteer');

const sz = async (year) => {
    let all = dateTool.getAllWeek(year);
    for (let m = 0; m < all.length; m++) {
        let month = all[m];
        for (let w = 0; w < month.length; w++) {
            let week = month[w].slice(1, 6).filter(day => day);
            for (let d = 0; d < week.length; d++) {
                let date = week[d].map((item, idx) => {
                    if (idx && item < 10) {
                        return '0' + item;
                    }
                    return item;
                }).join('-');
                if (Date.now() < new Date(`${date} 23:59:59`).getTime()) {
                    let [filePath, state] = await download.day.sz(date);
                    if (process.argv.includes('--input')) {
                        await input.day.sz(filePath, date);
                    } else if (state) {
                        await sleep();
                    }
                }
            }
        }
    }
};

let years = [2021, 2022];
(async () => {
    for (let i = 0; i < years.length; i++) {
        try {
            await sz(years[i]);
        } catch (e) { }
    }
})();

let keys = [subset.preset.ash[0], subset.preset.ksh[0]];
(async () => {
    for (let i = 0; i < keys.length; i++) {
        let codes = await subset.findOne({ key: keys[i] }, { projection: { _id: 0, key: 0 } });
        let list = Object.keys(codes);
        for (let j = 0; j < list.length; j++) {
            try {
                let [filePath, state] = await download.history.sh(list[j]);
                if (process.argv.includes('--input')) {
                    await input.history.sh(filePath, list[j]);
                } else if (state) {
                    await sleep();
                }
            } catch (e) { }
        }
    }
})();