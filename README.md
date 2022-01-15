#### 简介

一个A股本地筛选器, koa + mongodb 实现.

#### 基本操作

1. `node server/day.js` 下载当日数据并录入所有股票代码.
2. `node server/history.js` 下载历史数据.
3. `node server/info.js` 下载股票基本信息.
4. `node server/input.js` 录入数据库.

#### 目录结构

```
├── README.md
├── client
│   ├── babel.config.js
│   ├── index.html
│   ├── index.js
│   ├── info.js
│   ├── utils
│   │   ├── closest.js
│   │   ├── dom.js
│   │   ├── kline.js
│   │   ├── socket.js
│   │   └── url.js
│   ├── webpack.config.js
│   └── webpack.prod.js
├── node_modules
├── package-lock.json
├── package.json
└── server
    ├── actions.js
    ├── app.config.js
    ├── app.js
    ├── day.js
    ├── history.js
    ├── info.js
    ├── input.js
    ├── model
    │   ├── constant.js
    │   ├── subset.js
    │   └── ua.js
    ├── router
    │   ├── health.js
    │   └── index.js
    ├── rules.js
    └── utils
        ├── codes.js
        ├── data.js
        ├── index.js
        ├── mongo.js
        ├── observer.js
        ├── puppeteer.js
        ├── request.js
        ├── sleep.js
        └── xlsx.js
```
