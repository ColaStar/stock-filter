const path = require('path');
const fs = require('fs');
const { dateTool } = require('@tangyansoft/toolkit-common');
const { download, input } = require('./utils/data');
const subset = require('./model/subset');
const sleep = require('./utils/sleep');
const p = require('./utils/puppeteer');
const { getAllTradingDay } = require('./utils');

const sz = async (year) => {
    let dayList = getAllTradingDay(year);
    for (let i = 0; i < dayList.length; i++) {
        let date = dayList[i];
        if (Date.now() < new Date(`${date} 23:59:59`).getTime()) {
            let [filePath, state] = await download.day.sz(date);
            if (process.argv.includes('--input')) {
                await input.day.sz(filePath, date);
            } else if (state) {
                await sleep();
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