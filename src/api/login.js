import axios from 'axios'
import { APPKEY } from '../common/index.js'
import { Indicator, Toast } from 'mint-ui'

export const login = (loginMessage, suncFn, errorFn) => {
  Indicator.open('登录中...')
  let { phoneNum, verification, zone } = loginMessage
  axios.post('/sealfinance-api/login/userLogin', {
    appkey: APPKEY,
    code: verification,
    phone: phoneNum,
    zone: zone || '+86'
  })
    .then(function (response) {
      Indicator.close()
      let res = response.data
      if (res.code === '100000') {
        typeof suncFn === 'function' && suncFn(res.data)
      } else {
        Toast({
          message: '登录失败：' + res.message,
          position: 'middle',
          duration: 2000
        })
        throw new Error('登录失败：' + res.message)
      }
    })
    .catch(function (error) {
      Indicator.close()
      typeof errorFn === 'function' && errorFn(error)
    })
}

export const requireSecurityCode = (message, suncFn, errorFn) => {
  axios.post('/sealfinance-api/login/sendCode', {
    phone: message.phone,
    type: message.type
  })
    .then(function (response) {
      let res = response.data
      if (res.code === '100000') {
        Toast({
          message: '验证码获取成功！',
          position: 'middle',
          duration: 1000
        })
        typeof suncFn === 'function' && suncFn(res.data)
      } else {
        Toast({
          message: '验证码获取失败：' + res.message,
          position: 'middle',
          duration: 2000
        })
        throw new Error('登录失败：' + res.message)
      }
    })
    .catch(function (error) {
      typeof errorFn === 'function' && errorFn(error)
    })
}
