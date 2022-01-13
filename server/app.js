'use strict'

const koa = require('koa');
const app = new koa();
const bodyParser = require('koa-bodyparser');
const WebSocket = require('ws');
const appConfig = require('./app.config');
const router = require('./router/index');
const observer = require('./utils/observer');
const actions = require('./actions');

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.on('error', (err, ctx) => {
    ctx.body = 'error';
});

const server = app.listen(appConfig.port);
const wss = new WebSocket.WebSocketServer({ noServer: true });

observer.on('wss:send', (data) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(data));
    });
});

wss.on('connection', function connection(ws, request, client) {
    observer.emit('wss:send', { type: 'msg', data: { connection: true } });
    ws.on('message', function message(res) {
        let { type, data } = JSON.parse(res);
        observer.emit(type, data);
    });
});

server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
});