Koa.js middleware for processing GitHub Webhooks

This library is a small middleware for Koa.js web servers that handles all the logic of receiving and verifying webhook requests from website.
为ctx增加webhook属性<br>
方便平台判断


## Example
```
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
```
### ctx.webhook 示例：
```
# github
{ 
  platform: 'github',
  event: 'push',
  repository: 'test-webhook1',
  errToken: true
}
# coding
{
  platform: 'codding',
  event: 'push',
  repository: 'testwebhook',
  errToken: false
}
# doding test
{ 
  platform: 'codding',
  event: 'test',
  repository: 'unknow',
  errToken: false
}
# dockerHub
{ platform: 'dockerHub',
  event: 'unknow',
  repository: 'api',
  errToken: false }
```


coding 配置完成后会post一段测试数据

```
{ zen: 'Coding！ 让开发更简单', token: 'mrsixcoding' }
```

coding webhook header

```
{ 'user-agent': 'Coding.net Hook',
  'x-coding-event': 'push',
  'content-length': '1006',
  'content-type': 'application/json; charset=UTF-8',
  host: 'sunny.mrsix.top',
  connection: 'Keep-Alive',
  'accept-encoding': 'gzip,deflate' }
```
github 配置的 Secret 使用位于 req.header 的 "x-hub-signature" 中

github webhook header

```
{ host: 'sunny.mrsix.top',
accept: '*/*',
'user-agent': 'GitHub-Hookshot/24a53fc',
'x-github-event': 'push',
'x-github-delivery': '732c5c80-7cc8-11e7-9b13-16d831c4e638',
'content-type': 'application/json',
'x-hub-signature': 'sha1=6f558b1e8211e03430262320d1a74b3d4a113c2e',
'content-length': '6913' }
```

docker hub webhook header （无token配置）

```
{ host: 'sunny.mrsix.top',
  connection: 'keep-alive',
  'accept-encoding': 'gzip, deflate',
  accept: '*/*',
  'user-agent': 'python-requests/2.11.1',
  'content-type': 'application/json',
  'content-length': '11078',
  'x-newrelic-id': 'UQUFVFJUGwUJVlhaBgY=',
  'x-newrelic-transaction': 'PxRTBFMHXlYEVlJXUQkCBFdVFB8EBw8RVU4aBl0NUFRWUQtSBAcLVwYFU0NKQV1SVVwHAAECFTs=' }
```
