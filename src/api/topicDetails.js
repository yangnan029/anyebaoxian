import axios from 'axios'
import { getCookie } from '../common/cookie'
import { TOKEN } from '../common/index'
export const getTopicDetails = (topicIds, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/topic/selectTopicDetail',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      topicIds
    }
  })
    .then(response => {
      let res = response.data
      if (res.code === '100000') {
        typeof sucFn === 'function' && sucFn(res)
      } else {
        typeof errorFn === 'function' && errorFn(res)
      }
    })
    .catch((error) => {
      typeof errorFn === 'function' && errorFn(error)
    })
}
export const getCommentLists = (params, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/comment/selectCommentList',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: params
  })
    .then(response => {
      let res = response.data
      if (res.code === '100000') {
        typeof sucFn === 'function' && sucFn(res)
      } else {
        typeof errorFn === 'function' && errorFn(res)
      }
    })
    .catch((error) => {
      typeof errorFn === 'function' && errorFn(error)
    })
}
