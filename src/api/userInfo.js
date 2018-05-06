import axios from 'axios'
import {getCookie} from '../common/cookie'
import {TOKEN, APPKEY} from '../common/index'
import { Indicator, Toast } from 'mint-ui'

export const getUserInfo = (sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/user/selectUserInfo',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    }
  })
    .then(response => {
      let res = response.data
      if (res.code === '100000') {
        typeof sucFn === 'function' && sucFn(res.data)
      } else {
        typeof errorFn === 'function' && errorFn(res)
      }
    })
    .catch((error) => {
      typeof errorFn === 'function' && errorFn(error)
    })
}

export const updateUserInfo = (userInfo, sucFn, errorFn) => {
  Indicator.open('信息修改中...')
  axios({
    url: '/sealfinance-api/user/updateUserInfo',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: userInfo
  })
    .then(response => {
      Indicator.close()
      let res = response.data
      if (res.code === '100000') {
        Toast({
          message: '信息修改成功！',
          position: 'bottom',
          duration: 2000
        })
        typeof sucFn === 'function' && sucFn(res.data)
      } else {
        Toast({
          message: '信息修改失败，' + res.message,
          position: 'bottom',
          duration: 3000
        })
      }
    })
    .catch(error => {
      Indicator.close()
      typeof errorFn === 'function' && errorFn(error)
      Toast({
        message: '信息修改失败，请联系客服。',
        position: 'bottom',
        duration: 2000
      })
    })
}

export const updatePhone = (updatePhoneMsg, sucFn, errorFn) => {
  Indicator.open('手机号码修改中...')
  let { zone, newPhone, oldPhone, code } = updatePhoneMsg
  axios({
    url: '/sealfinance-api/user/updatePhone',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      appkey: APPKEY,
      code: code,
      newPhone: newPhone,
      oldPhone: oldPhone,
      zone: zone || '+86'
    }
  })
    .then(response => {
      Indicator.close()
      let res = response.data
      if (res.code === '100000') {
        Toast({
          message: '手机号码修改成功！',
          position: 'bottom',
          duration: 2000
        })
        typeof sucFn === 'function' && sucFn(res.data)
      } else {
        Toast({
          message: '手机号码修改失败，' + res.message,
          position: 'bottom',
          duration: 3000
        })
      }
    })
    .catch(error => {
      Indicator.close()
      typeof errorFn === 'function' && errorFn(error)
      Toast({
        message: '手机号码修改失败，请联系客服。',
        position: 'bottom',
        duration: 3000
      })
    })
}
