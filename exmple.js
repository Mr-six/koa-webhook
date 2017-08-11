const Koa = require('koa')
const app = new Koa()

const router = require('koa-router')()

const config = require('./config')  // 配置文件

const hook = require('./index')  // koa-webhook

// hook('token')  参数接受token值 可为字符串或者数组

router.post('/webhook',hook('mrsixcoding'), (ctx) => {
  let myhook = ctx.webhook
  console.dir(myhook)
  ctx.type = 'json'
  ctx.body = {"ok": true}
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port, () => {
  console.log('server start at http://localhost:' + config.port)
})
