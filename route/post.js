const Router = require('koa-router');
const Post = require('../models/post');

const api = new Router();

api.get('/post', async (ctx, next) => {
    let posts;

    try {
        posts = await Post.find().exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = posts;
});

module.exports = api;