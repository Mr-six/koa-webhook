/**
 * 解析上下文里node原生请求的POST参数
 * @param  {obj} ctx koa 
 * @return {Promise}  返回解析后的Promise对象
 */

function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        // let parseData = parseQueryStr( postdata )
        let parseData = postdata
        resolve( parseData )
      })
    } catch ( err ) {
      reject(err)
    }
  })
}

/**
 * 将POST请求参数字符串解析成JSON
 * @param  {String} queryStr 待解析的字符串
 * @return {Object} queryData 解析后的post对象
 */
function parseQueryStr( queryStr ) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  // console.log( queryStrList )
  for (  let [ index, queryStr ] of queryStrList.entries()  ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}

module.exports = parsePostData
