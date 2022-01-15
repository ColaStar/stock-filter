const { dateTool } = require('@tangyansoft/toolkit-common');
const { file } = require('@tangyansoft/toolkit-node');
const { input } = require('./utils/data');
const sleep = require('./utils/sleep');
const { getAllTradingDay } = require('./utils');

class Done {
    constructor(type = 'sz') {
        this.data = {};
        this.file = `${process.cwd()}/data/input-done-${type}.json`;
        try {
            this.data = require(this.file);
        } catch (e) { }
    }
    async set(key) {
        this.data[key] = 1;
        await file.write(this.file, JSON.stringify(this.data));
    }
    get(key) {
        return !!this.data[key];
    }
};

const inputSz = async () => {
    const done = new Done('sz');
    const sz = async (year) => {
        let weeks = dateTool.getAllWeek(year);
        let dayList = getAllTradingDay(year);
        for (let i = 0; i < dayList.length; i++) {
            let date = dayList[i];
            if (!done.get(date)) {
                await input.day.sz(`${process.cwd()}/data/day/sz/${date}.xlsx`, date);
                await done.set(date);
                console.log(`${date} 已录入`);
            }
        }
    };
    let years = [2021];
    for (let i = 0; i < years.length; i++) {
        await sz(years[i]);
    }
};

const inputSh = async () => {
    const done = new Done('sh');
    let files = file.getFiles(`${process.cwd()}/data/history/sh/`, [], (p) => /\.json/.test(p));
    for (let i = 0; i < files.length; i++) {
        let [, code] = files[i].match(/\/(\d+)\.json/);
        if (!done.get(code)) {
            try {
                await input.history.sh(files[i], code);
                await done.set(code);
                console.log(`${code} 已录入`);
            } catch (e) {
                file.write(`${process.cwd()}/data/error.txt`, `${code}\n`, { type: 'append' });
            }
        }
    }
};

const inputDay = async () => {
    let years = [2021, 2022];
    let start = '2021-12-27 00:00:00';
    let end = '2022-01-14 00:00:00';
    for (let i = 0; i < years.length; i++) {
        await (async (year) => {
            let dayList = getAllTradingDay(year);
            for (let j = 0; j < dayList.length; j++) {
                let date = dayList[j];
                let timestamp = dateTool.timestamp(`${date} 00:00:00`);
                if (timestamp >= dateTool.timestamp(start) && timestamp <= dateTool.timestamp(end)) {
                    await input.day.sz(`${process.cwd()}/data/day/sz/${date}.xlsx`, date);
                    await sleep(0.1);
                    await input.day.sh(`${process.cwd()}/data/day/sh/${date}.json`, date);
                    await sleep(0.1);
                    console.log(`${date} 已录入`);
                }
            }
        })(years[i]);
    }
};

const inputInfo = async () => {
    const done = new Done('info');
    let files = file.getFiles(`${process.cwd()}/data/info/`, [], (p) => /\.html/.test(p));
    for (let i = 0; i < files.length; i++) {
        let [, code] = files[i].match(/\/(\d+)\.html/) || ['', ''];
        if (!done.get(code)) {
            try {
                await input.info.basic(files[i], code);
                await done.set(code);
            } catch (e) {
                console.log(e)
                file.write(`${process.cwd()}/data/error.txt`, `${code}\n`, { type: 'append' });
            }
        }
    }
};

(async () => {
    await inputSz();
    await inputSh();
    await inputDay();
    await inputInfo();
})();


