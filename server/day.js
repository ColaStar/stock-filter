const { dateTool } = require('@tangyansoft/toolkit-common');
const { download, updateSubset, input } = require('./utils/data');
const xlsx = require('./utils/xlsx');
// 爬每日数据 如果需要录入直接加 --input
const date = dateTool.format(Date.now(), 'yyyy-MM-dd');

download.day.sz(date).then(res => {
    let [filePath] = res;
    const list = xlsx(filePath);
    updateSubset(list, 'sz');
    process.argv.includes('--input') && input.day.sz(filePath, date);
});
download.day.sh(date, 2075).then(res => {
    let [filePath] = res;
    const { list } = require(filePath);
    updateSubset(list, 'sh');
    process.argv.includes('--input') && input.day.sh(filePath, date);
});