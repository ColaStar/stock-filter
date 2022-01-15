const fs = require('fs');
const observer = require('./utils/observer');
const { dateTool, Compose, clone } = require('@tangyansoft/toolkit-common');
const { file } = require('@tangyansoft/toolkit-node');
const subset = require('./model/subset');
const { createActions } = require('./utils/mongo');
const sleep = require('./utils/sleep');
const rule = require('./rules');


const getAllSubset = (exclude = [subset.preset.bsh[0], subset.preset.bsz[0]]) => Object.keys(subset.preset).map(key => subset.preset[key][0]).filter(key => !exclude.includes(key));

const getKLineByCode = async (code, query) => {
    const codeCollection = createActions(code);
    const infoCollection = createActions('info');
    let lines = await codeCollection.findMany(query);
    let info = await infoCollection.findOne({ code });
    let arr = lines.sort((a, b) => a.timestamp - b.timestamp);
    await sleep(0.01);
    return [info || {}, arr];
};

const getAllKLine = async (query) => {
    let keys = getAllSubset();
    let result = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let codes = await subset.findOne({ key }, { projection: { _id: 0, key: 0 } });
        let list = Object.keys(codes);
        for (let j = 0; j < list.length; j++) {
            const code = list[j];
            try {
                if (/\d+$/.test(code)) {
                    let [info, arr] = await getKLineByCode(code, query);
                    result[key] = result[key] || [];
                    result[key].push([{ name: codes[code].name, code, ...info }, arr]);
                }
            } catch (e) {
                console.log(code, e);
            }
        }
    }
    return result;
};

const getKLineByFilter = async (data, query) => {
    let result = {};
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let list = data[key];
        for (let j = 0; j < list.length; j++) {
            let { name, code } = list[j][0];
            let [info, lines] = await getKLineByCode(code, query);
            result[key] = result[key] || [];
            result[key].push([{ name, code, ...info }, lines]);
        }
    }
    return result;
};


const filter = async (start = '2021-12-01', date) => {
    let compose = new Compose();
    compose.use((context, next) => {
        let result = rule.rule1(clone(context));
        observer.emit('wss:send', { type: 'get:filter:data', data: result });
        file.write(`${process.cwd()}/data/filter/${date}.json`, JSON.stringify(result));
        Object.keys(result).forEach(key => { console.log(key, result[key].length) });
        return next();
    });
    compose.use(async (context, next) => {
        return next();
    });
    let all = await getAllKLine({ timestamp: { $gt: new Date(`${start} 00:00:00`).getTime() } });
    compose.exec({ all });
};

const history = async (start, date, rule) => {
    let result = {};
    let data = null;
    let dataFile = null;
    if (rule) {
        dataFile = `${process.cwd()}/data/filter/${date}-${rule}.json`;
    } else {
        dataFile = `${process.cwd()}/data/filter/${date}-1.json`;
        !fs.existsSync(dataFile) && (dataFile = `${process.cwd()}/data/filter/${date}.json`);
    }
    if (fs.existsSync(dataFile)) {
        data = require(dataFile);
    }
    if (data) {
        result = await getKLineByFilter(data, { timestamp: { $gt: new Date(`${start} 00:00:00`).getTime() } });
    }
    observer.emit('wss:send', { type: 'get:history:data', data: result });
};

observer.on('get:filter:data', data => {
    console.log('get:filter:data', data);
    let { start, date } = data;
    let p = `${process.cwd()}/data/filter/${date}.json`;
    let filterFile = `${process.cwd()}/data/filter/${date}-1.json`;
    if (fs.existsSync(p)) {
        let result = require(p);
        let filterData = fs.existsSync(filterFile) ? JSON.parse(fs.readFileSync(filterFile)) : null;
        observer.emit('wss:send', { type: 'get:filter:data', data: result, filter: filterData });
    } else {
        filter(start, date, 'socket').catch(err => {
            console.log(err)
        });
    }
});

observer.on('get:history:data', data => {
    console.log('get:history:data', data);
    let { start, date, rule } = data;
    history(start, date, rule);
});

observer.on('save:data', res => {
    let { date, data } = res;
    file.write(`${process.cwd()}/data/filter/${date}-1.json`, JSON.stringify(data));
});

module.exports = {
    filter
};