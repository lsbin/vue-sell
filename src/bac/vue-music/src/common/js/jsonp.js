import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  // url的拼接
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    // 原始jsonp方法的调用
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// url拼接的方法
function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''

    url += `&${k}=${encodeURIComponent(value)}`
  }

  return url ? url.substring(1) : ''
}
