'use strict'

const Router = require('@koa/router');
const router = new Router();
const health = require('./health');

router.use(health.routes()).use(health.allowedMethods());

module.exports = router;