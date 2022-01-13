
import socket from './utils/socket';
import closest from './utils/closest';
import kline from './utils/kline';
import info from './info';
import url from './utils/url';
import { dateTool } from '@tangyansoft/toolkit-common';

let result = {};
let date = dateTool.format(new Date().getTime(), 'yyyy-MM-dd');
let start = '2021-12-01';

socket.on('get:data', (date) => {
  let history = url.val('history');
  if (history) {
    socket.send('get:history:data', { start, date: history }).then((res) => {
      let { data } = res;
      let list = [];
      let count = {};

      Object.keys(data).forEach(key => {
        list = list.concat(data[key]);
        list.forEach(item => {
          count[key] = count[key] || [0, 0];
          let [close, open , now] = item[3][item[3].length - 1].data;
          let idx = now > open ? 0 : 1; 
          count[key][idx] = count[key][idx] + 1;
        });
      });
      list = list.sort((a, b) => {
        let [, a1, a2,] = a[3][a[3].length - 1].data;
        let [, b1, b2,] = b[3][b[3].length - 1].data;
        return b2 / b1 - a2 / a1;
      });
      list.forEach(item => {
        kline(info({ code: item[1], name: item[0] }), item[3]);
      });
      console.log(count);
    });
  } else {
    socket.send('get:filter:data', { start, date }).then(res => {
      let { data, filter } = res;
      let list = [];
      Object.keys(data).forEach(key => {
        result[key] = data[key].filter(item => filter ? filter[key].some(select => +item[1] === +select[1]) : true);
        list = list.concat(result[key]);
      });
      list.forEach(item => {
        kline(info({ code: item[1], name: item[0] }), item[3]);
      });
    });
  }
});


document.body.addEventListener('click', (event) => {
  let { type } = event.target.dataset;
  switch (type) {
    case 'del':
      let box = closest(event.target, '.js-container');
      let { code } = box.dataset;
      Object.keys(result).forEach(key => {
        result[key] = result[key].filter(item => {
          return !(+code === +item[1])
        });
      });
      box.remove();
      break;

    case 'save':
      if (url.val('history') !== date) {
        Object.keys(result).forEach(key => {
          result[key] = result[key].map(item => item.slice(0, 2));
        });
        socket.send('save:data', { date, data: result });
      }
      break;

    case 'get':
      socket.emit('get:data', date);
      break;
  }
});