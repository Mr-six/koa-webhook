const Koa = require('koa')
const app = new Koa()

const config = require('./config')  // 配置文件

const hook = require('./index')  // koa-webhook

app.use(hook('mrsixcoding'))

app.use((ctx) => {
  let myhook = ctx.webhook
  console.dir(myhook)
  ctx.type = 'json'
  ctx.body = {"ok": true}
})

app.listen(config.port, () => {
  console.log('server start at http://localhost:' + config.port)
})
