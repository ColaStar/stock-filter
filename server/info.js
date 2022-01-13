const { file } = require('@tangyansoft/toolkit-node');
const { info } = require('./utils/data');
const subset = require('./model/subset');
const sleep = require('./utils/sleep');
const p = require('./utils/puppeteer');


let keys = [subset.preset.ash[0], subset.preset.ksh[0], subset.preset.msz[0], subset.preset.csz[0]];
(async () => {
    for (let i = 0; i < keys.length; i++) {
        let codes = await subset.findOne({ key: keys[i] }, { projection: { _id: 0, key: 0 } });
        let list = Object.keys(codes);
        for (let j = 0; j < list.length; j++) {
            try {
                let [filePath, state] = await info.all(list[j]);
                if (process.argv.includes('--input')) {

                } else if (state) {
                    await sleep();
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
})();