const Router = require('koa-router');
const User = require('../models/user');

const api = new Router();

api.post('/user', async (ctx, next) => {
    // const {
    //     name,
    //     email,
    //     password
    // } = ctx.request.body;
    const name = "test"
    const email = "email"
    const password = "password"

    const user = new User({
        name,
        email,
        password
    });

    try {
        await user.save()
    } catch(e) {
        return ctx.throw(500, e);
    }

    ctx.body = user;
});

api.get('/user', async (ctx, next) => {
    let users;

    try {
        users = await User.find().exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = users;
});

api.get('/user/:id', async (ctx, next) => {
    const { id } = ctx.params

    let user;

    try {
        user = await User.findById(id).exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    if(!user) {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
        return;
    }

    ctx.body = user;
});

api.delete('/user/:id', async (ctx, next) => {
    const { id } = ctx.params

    let user;

    try {
        await User.findByIdAndRemove(id).exec();
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }

    ctx.status = 204; // No Content
});

api.update('/user/:id', async (ctx, next) => {
    const { id } = ctx.params

    let user;

    try {
        user = await User.findByIdAndUpdate(id, ctx.request.body, {
            new: true
        });
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.status = 204; // No Content
});

module.exports = api;