const Router = require('koa-router');

const api = new Router();

api.get('/test', (ctx, next) => {
    ctx.body = 'test'
    ctx.respond = true
});

module.exports = api;