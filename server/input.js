const { dateTool } = require('@tangyansoft/toolkit-common');
const { file } = require('@tangyansoft/toolkit-node');
const { input } = require('./utils/data');
const sleep = require('./utils/sleep');

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
                    if (!done.get(date)) {
                        await input.day.sz(`${process.cwd()}/data/day/sz/${date}.xlsx`, date);
                        await done.set(date);
                    }
                }
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
            } catch (e) {
                file.write(`${process.cwd()}/data/error.txt`, `${code}\n`, { type: 'append' });
            }
        }
    }
};

const inputDay = async () => {
    let arr = ['2021-12-27', '2021-12-28', '2021-12-29', '2021-12-30', '2021-12-31', '2022-01-04'];
    for(let i = 0; i < arr.length; i++) {
        let date = arr[i];
        await input.day.sz(`${process.cwd()}/data/day/sz/${date}.xlsx`, date);
        await sleep(0.1);
        await input.day.sh(`${process.cwd()}/data/day/sh/${date}.json`, date);
        await sleep(0.1);
    }
};

const inputInfo = async () => {
    const done = new Done('info');
    let files = file.getFiles(`${process.cwd()}/data/info/`, [], (p) => /\.html/.test(p));
    for (let i = 0; i < files.length; i++) {
        let [, code] = files[i].match(/\/(\d+)\.html/);
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

(async() => {
    // await inputSz();
    // await inputSh();
    // await inputDay();
    await inputInfo();
})();


