const xlsx = require('node-xlsx');

const readXlsx = p => {
    let result = [];
    let data = xlsx.parse(p);
    for (let i = 0; i < data.length; i++) {
        let sheet = data[i];
        for (let j = 0; j < sheet['data'].length; j++) {
            result.push(sheet['data'][j]);
        }
    }
    return result;
};

module.exports = readXlsx;