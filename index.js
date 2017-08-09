const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

const config = require('./config')  // 配置文件
const parsePostData = require('./utils')  // 引入解析post参数工具

// 使用ctx.body解析中间件
// app.use(bodyParser())

app.use(async (ctx) => {
  // let param = ctx.request.body
  let header = ctx.header
  // let {'X-GitHub-Event', 'X-Hub-Signature'} = header
  let param = await parsePostData(ctx)
  console.dir(param.repository)
  console.dir(header)
  ctx.type = 'json'
  ctx.body = {"ok": true}
})

app.listen(config.port, () => {
  console.log('server start at http://localhost:' + config.port)
})
