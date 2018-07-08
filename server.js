const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const {join} = require('path')
const api = require('./route/api.js');
const userApi = require('./route/user.js');
const dbConfig = require('./db/config.js');
const dbSetup = require('./db/setup.js');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = new Koa()
        const router = new Router()

        //귀찮으니깐 우선 걍 접속
        dbSetup(dbConfig['development'])

        router.get('/service-worker.js', async ctx => {
            const pathname = await join(__dirname, '.next', 'service-worker.js')
            ctx.body = await app.serveStatic(ctx.req, ctx.res, pathname)
            ctx.respond = true
        })

        router.get('/healthcheck', async ctx => {
            ctx.body = 'ok'
            ctx.respond = true
        })

        router.use('/api', api.routes());
        router.use('/user', userApi.routes());

        router.get('*', async ctx => {
            await handle(ctx.req, ctx.res)
            ctx.respond = false
        })

        server.use(async (ctx, next) => {
            ctx.res.statusCode = 200
            await next()
        })

        server.use(router.routes())
        server.listen(port, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${port}`)
        })
    })
