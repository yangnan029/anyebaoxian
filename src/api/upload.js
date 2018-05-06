import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import { getCookie } from '../common/cookie'
import { TOKEN } from '../common/index'

export const upload = (uploadMsg, suncFn, errorFn) => {
  Indicator.open('图片上传中...')
  axios({
    url: '/anyebaoxian-api/user/uploadHeadPhotoH5',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: uploadMsg
  })
    .then(function (response) {
      Indicator.close()
      let res = response.data
      if (res.code === '100000') {
        typeof suncFn === 'function' && suncFn(res.data)
        Toast({
          message: '图片上传成功！',
          position: 'middle',
          duration: 2000
        })
      } else {
        Toast({
          message: '图片上传失败，' + res.message,
          position: 'middle',
          duration: 2000
        })
      }
    })
    .catch(function (error) {
      Indicator.close()
      typeof errorFn === 'function' && errorFn(error)
      Toast({
        message: '图片上传失败，请联系客服。',
        position: 'middle',
        duration: 2000
      })
    })
}
