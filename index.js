const crypto = require('crypto')
const parsePostData = require('./utils')  // 引入解析post参数工具

async function webhook (ctx, next, token) {
  let header = ctx.header
  let postData = await parsePostData(ctx)  // postData
  let event = 'unknow'  // 触发事件
  let repository = 'unknow'  // repository name
  let platform = 'unknow'
  let errToken = false
  // 当前平台
  let currentPlatform = header['user-agent']
  
  let platfors = {  // 平台检测依据
    github: /GitHub/i,
    codding: /Coding/i,
    dockerHub: /python-requests/i
  }

  // 判断平台(注：header中的键被转成来小写)
  if (platfors.github.test(currentPlatform)) {  // github 执行逻辑
    platform = Object.keys(platfors)[0]

    event = header['x-github-event']
    repository = postData.data.repository.name  // 项目名称
    if (token) {  // token 验证
      let compsig = signBlob(token, postData.buff)
      let headersig = header['x-hub-signature']
      errToken = !(headersig === compsig)
    }

  } else if (platfors.codding.test(currentPlatform)) {  // coding 执行逻辑
    platform = Object.keys(platfors)[1]

    if (!postData.data.zen) {   // 测试验证
      event = postData.data.event  // event
      repository = postData.data.repository.name  // 项目名称
    } else {
      event = 'test'
    }
    
    if (token) {  // token 验证
      errToken = !(token === postData.data.token)
    }

  } else if (platfors.dockerHub.test(currentPlatform)) {  // dockerhub 执行逻辑
    platform = Object.keys(platfors)[2]
    
    repository = postData.data.repository.name  // 项目名称
  }

  ctx.webhook = {  // 为 ctx 添加 webhook 属性
    platform,
    event,
    repository,
    errToken
  }
  await next()
  // console.log(ctx.request.webhook)
}

// github secret  算法
function signBlob (key, blob) {
  return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex')
}

module.exports = function (token) {
  return function ( ctx, next ) {
    return webhook(ctx, next, token);
  }
}
