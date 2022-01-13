'use strict';

const Router = require('@koa/router');
const router = new Router({
  prefix: '/health'
});

let healthStatusCode = 200;

router.get('/:action', ctx => {
  let statusCode = 200;
  const { action } = ctx.params;
  const limit = ['offline', 'online'];
  limit.forEach((item) => {
    if (item === action) {
      // 上下线只允许 ip 为 127.0.0.1 的请求.
      if (/127\.0\.0\.1/.test(ctx.ip)) {
        return;
      }
      statusCode = 403;
    }
  });
  ctx.status = ({ status: healthStatusCode })[action] || statusCode;
  ctx.body = `${ctx.ip} ${action}`;
});

module.exports = router;
