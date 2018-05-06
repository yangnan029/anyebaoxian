export const APPKEY = '20a08b54bbba9'
export const TOKEN = 'token'
export const USER = 'user'
export const PRODUCTCODE = 'sealfinance'
export const QUESTION_TYPE = 1758
export const COMMONTOPIC_TYPE = 1750
export const FEEDBACK_TYPE = 1756
const OSS = require('ali-oss')
const morentouxiang = require('../assets/touxiang.png')

export const renderText = text => {
  try {
    text = unescape(decodeURIComponent(text))
  } catch (err) {
    text = unescape(text)
  }
  try {
    text = unescape(decodeURIComponent(text))
  } catch (err) {
    text = unescape(text)
  }
  return text
}

export const getDateDiff = dateStr => {
  var publishTime
  if (typeof dateStr === 'undefined') {
    publishTime = new Date().getTime() / 1000
  } else {
    var dateArr = dateStr.split(/[-/\s:]/g)
    publishTime = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]).getTime() / 1000
  }
  var dseconds
  var dminutes
  var dhours
  var ddays
  var timeNow = parseInt(new Date().getTime() / 1000)
  var d
  var date = new Date(publishTime * 1000)
  var Y = date.getFullYear()
  var M = date.getMonth() + 1
  var D = date.getDate()
  var H = date.getHours()
  var m = date.getMinutes()
  var s = date.getSeconds()
  // 小于10的在前面补0
  if (M < 10) {
    M = '0' + M
  }
  if (D < 10) {
    D = '0' + D
  }
  if (H < 10) {
    H = '0' + H
  }
  if (m < 10) {
    m = '0' + m
  }
  if (s < 10) {
    s = '0' + s
  }

  d = timeNow - publishTime
  ddays = parseInt(d / 86400)
  dhours = parseInt(d / 3600)
  dminutes = parseInt(d / 60)
  dseconds = parseInt(d)
  var dmonth = parseInt(d / (86400 * 30))
  var dyear = parseInt(d / (86400 * 30 * 12))

  if (ddays > 0 && dmonth < 1) {
    return ddays + '天前'
  } else if (ddays <= 0 && dhours > 0) {
    return dhours + '小时前'
  } else if (dhours <= 0 && dminutes > 0) {
    return dminutes + '分钟前'
  } else if (dseconds < 60) {
    if (dseconds <= 0) {
      return '刚刚发表'
    } else {
      return dseconds + '秒前'
    }
  } else if (dmonth >= 1 && dyear < 1) {
    return dmonth + '月前'
  } else {
    return Y + '.' + M + '.' + D
  }
}

export const getNumDiff = num => {
  if (num >= 1000 && num < 10000) {
    return (num / 1000).toFixed(1) + 'k'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else {
    return num || '0'
  }
}

export const fetchImg = objectKey => {
  if (!objectKey) {
    return morentouxiang
  } else if (/^https?:\/\//.test(objectKey)) {
    return objectKey
  } else {
    const client = new OSS({
      region: 'oss-cn-shanghai',
      accessKeyId: 'LTAI76zinJU7l8VF',
      accessKeySecret: 'ifTP8WsjseZubFBx4hYBM6fmpxBoZk',
      bucket: 'artstory'
    })
    return client.signatureUrl(objectKey)
  }
}
