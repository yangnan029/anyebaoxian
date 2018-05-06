import axios from 'axios'
import { getCookie } from '../common/cookie'
import { TOKEN, PRODUCTCODE } from '../common/index'
import router from '../router'
import { Toast } from 'mint-ui'

export const getTopicList = (pageNum, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/topic/selectCommunityList',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      pageNum
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

export const favorContent = (message, sucFn, errorFn) => {
  if (!getCookie(TOKEN)) {
    router.push('/login')
    Toast({
      message: '点赞要先登录哦!',
      position: 'middle',
      duration: 2000
    })
    return
  }
  axios({
    url: '/sealfinance-api/topic/favorTopic',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || '',
      title: escape(message.title),
      authorId: message.creatorAccount
    },
    data: {
      productCode: PRODUCTCODE,
      objectId: message.id,
      appraiseType: 1,
      score: 1,
      objectType: message.type === 1 ? 'topic' : 'comment'
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

export const collectContent = (message, sucFn, errorFn) => {
  if (!getCookie(TOKEN)) {
    router.push('/login')
    Toast({
      message: '收藏要先登录哦!',
      position: 'middle',
      duration: 2000
    })
    return
  }
  let path = message.collect ? '/sealfinance-api/topic/collectTopic' : '/sealfinance-api/topic/cancelTopic'
  axios({
    url: path,
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || '',
      title: escape(message.title),
      authorId: message.creatorAccount,
      labelIds: message.selectedTag
    },
    data: {
      productCode: PRODUCTCODE,
      objectId: message.id,
      objectType: message.type === 1 ? 'topic' : 'comment'
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

export const createContent = (message, sucFn, errorFn) => {
  if (!getCookie(TOKEN)) {
    router.push('/login')
    Toast({
      message: '发布话题要先登录哦!',
      position: 'middle',
      duration: 2000
    })
    return
  }
  message.content = message.content || ''
  message.imageUrls = message.imageUrls || []
  axios({
    url: '/sealfinance-api/topic/releaseTopic',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      content: {
        composeType: 'onlyMain',
        mainContent: {
          isprivate: 1,
          subCount: 0,
          isStream: false,
          title1: escape(message.title),
          typeMedia: 4,
          typePattern: 1,
          typeSize: 1,
          type1: message.type,
          detail: escape(message.content),
          playStreaming: 'null',
          playURL: 'null',
          image1: 'null',
          creatorAccount: 3,
          imageUrls: message.imageUrls.map(e => e.fileName),
          isValid: true
        }
      }
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

export const getMyTopicList = (pageNum, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/topic/selectTopicList',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      pageNum
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

export const deleteMyTopic = (topicIds, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/topic/deleteMyTopic',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      topicIds: topicIds
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

export const getOtherTopic = (message, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/topic/selectAuthorTopicList',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || ''
    },
    data: {
      authorId: message.authorId,
      pageNum: message.pageNum
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

export const getMycollected = (message, sucFn, errorFn) => {
  axios({
    url: '/sealfinance-api/topic/selectCollectTopicByLabel',
    method: 'post',
    headers: {
      token: getCookie(TOKEN) || '',
      labelids: (message.labelIds ? message.labelIds : []).join(',')
    },
    data: {
      pageNum: message.pageNum,
      objectType: 'topic'
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
