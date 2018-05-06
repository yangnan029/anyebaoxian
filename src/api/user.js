import axios from 'axios'
import { getCookie } from '../common/cookie'
import { TOKEN } from '../common/index'

export const followUser = (message, sucFn, errorFn) => {
  let path = message.follow ? '/sealfinance-api/user/followUser' : '/sealfinance-api/user/cancelFollowUser'
  axios({
    url: path,
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || '',
      authorId: message.creatorAccount
    },
    data: {
      authorId: message.creatorAccount
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

export const getFollowInfo = (message, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/user/getFollowInfo',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      followUserId: message.followUserId
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

export const getFollowList = (pageNum, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/user/selectAuthorList',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      pageNum: pageNum
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
