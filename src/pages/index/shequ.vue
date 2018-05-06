<template>
  <div class="index-shequ">
    <div class="index-shequ-container">
      <div class="index-shequ-content">
        <div>
          <div class="search-box">
            <input class="search-input" type="text" name="">
            <span>&nbsp;|&nbsp;</span>
            <img class="search-btn" src="../../assets/search-b.png">
          </div>
        </div>
        <div>
          <div class="xiaoketang">
            <p>NEW</p>
            <h1>海豹小课堂</h1>
            <h2>检查你的财务</h2>
            <p>点击查看</p>
          </div>
        </div>
        <div class="fenge-30">&nbsp;</div>
        <div class="question">
          <div class="header">
            <div class="header-left">
              <p>有问必答&nbsp;&nbsp;|</p>
              <span>有啥理财困惑，来找海豹们帮忙解答吧</span>
            </div>
            <div class="header-right">
              <img src="../../assets/qudati.png">
            </div>
          </div>
          <div class="question-box">
            <input type="text" placeholder="请输入您的问题" v-model="question">
            <img @click.stop="createQuestion" src="../../assets/tiwen-anniu.png">
          </div>
          <div @click="goDetail(item)" v-if="!item.mainContent.deleted" v-for="(item, index) in wenti.filter(e => !e.mainContent.deleted).slice(0, 3)" :key="index + 'q'" class="question-item">
            <h2 class="question-title">{{renderText(item.mainContent.title1)}}</h2>
            <p class="question-content">{{renderComment(item.mainContent)}}</p>
            <div class="question-bottom">
              <div @click.stop="goOtherTopic(item)" class="question-user">
                <img class="question-user-photo" v-once :src="fetchImg(item.mainContent.photoUrl)">
                <div>
                  <p class="question-user-nickname">{{renderText(item.mainContent.nickName)}}</p>
                  <span class="question-publishtime">{{getDateDiff(item.mainContent.createTime)}}</span>
                </div>
              </div>
              <img @click.stop="collectTopic(item)" class="userAction" :src="item.mainContent.collectByCurrUser ? collectedBtn1 : uncollectedBtn1">
              <img @click.stop="favorTopic(item)" class="userAction" :src="item.mainContent.favorByCurrUser ? favorBtn1 : unfavorBtn1">
            </div>
            <img class="question-answerbtn" src="../../assets/answer.png">
          </div>
          <p class="morequestion">查看所有问题&nbsp;&nbsp;<img src="../../assets/sanjiao.png"></p>
        </div>
        <div class="fenge-30">&nbsp;</div>
        <div class="topic">
          <div class="topic-header">
            <p>话题精选&nbsp;&nbsp;|</p>
          </div>
          <div class="topic-item" @click="goDetail(item)" v-if="!item.mainContent.deleted" v-for="(item, index) in jinhuaTopic" :key="index + 'JT'">
            <div class="topic-item-header">
              <div @click.stop="goOtherTopic(item)" class="topic-item-header-left">
                <img v-once :src="fetchImg(item.mainContent.photoUrl)"/>
                <div>
                  <p>{{renderText(item.mainContent.nickName)}}</p>
                  <span>{{getDateDiff(item.mainContent.createTime)}}</span>
                </div>
              </div>
              <div class="topic-item-header-right">
                <img class="jinghuaIcon" src="../../assets/jing.png"/>
                <img class="guanzhuIco" v-if="user.id != item.mainContent.creatorAccount" @click.stop="followUser(item)" :src="item.mainContent.follow ? followedIcon : unFollowIcon"/>
              </div>
            </div>
            <div class="topic-item-title">
              {{renderText(item.mainContent.title1)}}
            </div>
            <div class="topic-item-content">
              {{renderText(item.mainContent.abstractText)}}
            </div>
            <div class="topic-item-useraction">
              <div @click.stop="favorTopic(item)" class="favor">
                <img :src="item.mainContent.favorByCurrUser ? favorBtn2 : unfavorBtn2">
                <span>赞&nbsp;({{getNumDiff(item.mainContent.favorCount)}})</span>
              </div>
              <div @click.stop="collectTopic(item)" class="collect">
                <img :src="item.mainContent.collectByCurrUser ? collectedBtn2 : uncollectedBtn2">
                <span>收藏</span>
              </div>
              <div class="comment">
                <img src="../../assets/pinglun.png">
                <span>评论&nbsp;({{getNumDiff(item.mainContent.commentCount)}})</span>
              </div>
            </div>
            <div class="fenge-10"></div>
          </div>
          <div class="topic-item" @click="goDetail(item)" v-if="!item.mainContent.deleted" v-for="(item, index) in commonTopic" :key="index + 'CT'">
            <div class="topic-item-header">
              <div @click.stop="goOtherTopic(item)" class="topic-item-header-left">
                <img v-once :src="fetchImg(item.mainContent.photoUrl)"/>
                <div>
                  <p>{{renderText(item.mainContent.nickName)}}</p>
                  <span>{{getDateDiff(item.mainContent.createTime)}}</span>
                </div>
              </div>
              <div class="topic-item-header-right">
                <img class="guanzhuIco" v-if="user.id != item.mainContent.creatorAccount" @click.stop="followUser(item)" :src="item.mainContent.follow ? followedIcon : unFollowIcon"/>
              </div>
            </div>
            <div class="topic-item-title">
              {{renderText(item.mainContent.title1)}}
            </div>
            <div class="topic-item-content">
              {{renderText(item.mainContent.abstractText)}}
            </div>
            <div class="topic-item-useraction">
              <div @click.stop="favorTopic(item)" class="favor">
                <img :src="item.mainContent.favorByCurrUser ? favorBtn2 : unfavorBtn2">
                <span>赞&nbsp;({{getNumDiff(item.mainContent.favorCount)}})</span>
              </div>
              <div @click.stop="collectTopic(item)" class="collect">
                <img :src="item.mainContent.collectByCurrUser ? collectedBtn2 : uncollectedBtn2">
                <span>收藏</span>
              </div>
              <div class="comment">
                <img src="../../assets/pinglun.png">
                <span>评论&nbsp;({{getNumDiff(item.mainContent.commentCount)}})</span>
              </div>
            </div>
            <div class="fenge-10"></div>
          </div>
        </div>
        <load-more @click.native="loadMore" :show-loading="fetching" :tip="loadTip"></load-more>
      </div>
      <div class="releaseTopic-btn">
        <router-link to="/publishTopic">
          <img src="../../assets/fabu.png">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import './shequ.less'
import { getTopicList, favorContent, collectContent, createContent } from '../../api/topic'
import { followUser } from '../../api/user.js'
import { QUESTION_TYPE, renderText, getDateDiff, getNumDiff, fetchImg } from '../../common/index'
import { Bus } from '../../common/bus.js'
import { LoadMore } from 'vux'
import { Toast } from 'mint-ui'
import _ from 'lodash'
// import { Indicator, Toast } from 'mint-ui'

export default {
  name: 'shequ',
  data: function () {
    return {
      wenti: [],
      jinhuaTopic: [],
      commonTopic: [],
      collectedBtn1: require('../../assets/shoucang-wenti.png'),
      uncollectedBtn1: require('../../assets/shoucang-wenti-weixuan.png'),
      favorBtn1: require('../../assets/guanzhu.png'),
      unfavorBtn1: require('../../assets/guanzhu-weixuan.png'),
      collectedBtn2: require('../../assets/yishoucang.png'),
      uncollectedBtn2: require('../../assets/shoucang-.png'),
      favorBtn2: require('../../assets/yizan.png'),
      unfavorBtn2: require('../../assets/zan.png'),
      followedIcon: require('../../assets/yiguanzhu.png'),
      unFollowIcon: require('../../assets/weiguanzhu.png'),
      morentouxiang: require('../../assets/touxiang.png'),
      fetching: true,
      pageNum: 0,
      nomore: false,
      question: ''
    }
  },
  computed: {
    loadTip: function () {
      return this.nomore ? '没有更多了' : this.fetching ? '正在加载' : '加载更多'
    },
    user: function () {
      return this.$store.state.user.user
    }
  },
  methods: {
    getTopicListSuccess: function (res) {
      res.typeWithContentList[0].contentList.reduce((a, b) => {
        b.mainContent.deleted = false
        a.push(b)
        return a
      }, this.wenti)
      res.typeWithContentList[1].contentList.reduce((a, b) => {
        b.mainContent.deleted = false
        a.push(b)
        return a
      }, this.jinhuaTopic)
      res.typeWithContentList[2].contentList.reduce((a, b) => {
        b.mainContent.deleted = false
        a.push(b)
        return a
      }, this.commonTopic)
      this.fetching = false
      this.nomore = res.typeWithContentList[2].contentList.length < 10
    },
    scrollHandler: function (e) {
      let wrap = document.getElementsByClassName('index-shequ-container')[0]
      let content = document.getElementsByClassName('index-shequ-content')[0]
      let scrollTop = wrap.scrollTop
      window.sessionStorage.scrollTop = scrollTop
      let wrapHeight = wrap.offsetHeight
      let contentHeight = content.offsetHeight
      let heightDiff = contentHeight - wrapHeight
      if (scrollTop >= heightDiff - 10) {
        this.loadMore()
      }
    },
    renderComment: function (item) {
      let comment = item.comment
      comment = comment ? (renderText(comment.abstractText) ? renderText(comment.abstractText) : '[图片]') : '这个问题正在等着有缘人来解答,快来看看吧！'
      return comment
    },
    favorSuccess: function (item, res) {
      item.mainContent.favorByCurrUser = true
      item.mainContent.favorCount += 1
    },
    favorFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    favorTopic: function (item) {
      if (+this.user.id === +item.mainContent.creatorAccount) {
        Toast({
          message: '不能给自己点赞哦！',
          position: 'middle',
          duration: 1000
        })
        return
      }
      let mainContent = item.mainContent
      if (!mainContent.favorByCurrUser) {
        let msg = {}
        msg.id = mainContent.id
        msg.type = 1
        msg.title = mainContent.title1
        msg.creatorAccount = mainContent.creatorAccount
        favorContent(msg, this.favorSuccess.bind(this, item), this.favorFail)
      }
    },
    collectSuccess: function (item, res) {
      item.mainContent.collectByCurrUser = !item.mainContent.collectByCurrUser
    },
    collectFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    collectTopic: function (item) {
      if (+this.user.id === +item.mainContent.creatorAccount) {
        Toast({
          message: '不能收藏自己的哦！',
          position: 'middle',
          duration: 1000
        })
        return
      }
      let mainContent = item.mainContent
      let msg = {}
      msg.id = mainContent.id
      msg.type = 1
      msg.title = mainContent.title1
      msg.creatorAccount = mainContent.creatorAccount
      msg.selectedTag = []
      // TODO:获取selectedTag
      if (!mainContent.collectByCurrUser) {
        msg.collect = true
      } else {
        msg.collect = false
      }
      collectContent(msg, this.collectSuccess.bind(this, item), this.collectFail)
    },
    followSuccess: function (item, res) {
      let isfollow = !item.mainContent.follow
      this.jinhuaTopic.forEach(e => {
        if (e.mainContent.creatorAccount === item.mainContent.creatorAccount) {
          e.mainContent.follow = isfollow
        }
      })
      this.commonTopic.forEach(e => {
        if (e.mainContent.creatorAccount === item.mainContent.creatorAccount) {
          e.mainContent.follow = isfollow
        }
      })
    },
    followFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    followUser: function (item) {
      let mainContent = item.mainContent
      let msg = {}
      msg.follow = !mainContent.follow
      msg.creatorAccount = mainContent.creatorAccount
      followUser(msg, this.followSuccess.bind(this, item), this.followFail)
    },
    refreshQuestion: function (res) {
      this.question = ''
      this.wenti = res.typeWithContentList[0].contentList
    },
    createQuestionSuccess: function (res) {
      getTopicList(1, this.refreshQuestion, err => console.log(err))
    },
    createQuestionFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    createQuestion: function () {
      let question = _.trim(this.question)
      if (!question) {
        Toast({
          message: '问题不能为空哦！',
          position: 'middle',
          duration: 2000
        })
      } else {
        let msg = {}
        msg.title = question
        msg.type = QUESTION_TYPE
        createContent(msg, this.createQuestionSuccess, this.createQuestionFail)
      }
    },
    goDetail: function (item) {
      this.$router.push('/topicDetail?id=' + item.mainContent.id)
    },
    refreshTopic: function (res) {
      this.commonTopic.unshift(res.typeWithContentList[2].contentList[0])
    },
    loadMore: function () {
      if (this.fetching || this.nomore) {
        return
      }
      this.fetching = true
      getTopicList(++this.pageNum, this.getTopicListSuccess, err => console.log(err))
    },
    publishSuccessHandler: function () {
      getTopicList(1, this.refreshTopic, err => console.log(err))
    },
    commentSuccessHandler: function (id, comment) {
      let commentedWenti = this.wenti.find(e => e.mainContent.id === id)
      if (commentedWenti) {
        commentedWenti.mainContent.comment.abstractText = comment
      }
    },
    collectSuccessHandler: function (id) {
      let topcWenti = this.wenti.find(e => e.mainContent.id === id)
      let topicSystem = this.jinhuaTopic.find(e => e.mainContent.id === id)
      let topicCommon = this.commonTopic.find(e => e.mainContent.id === id)
      if (topcWenti) {
        topcWenti.mainContent.collectByCurrUser = !topcWenti.mainContent.collectByCurrUser
      } else if (topicSystem) {
        topicSystem.mainContent.collectByCurrUser = !topicSystem.mainContent.collectByCurrUser
      } else if (topicCommon) {
        topicCommon.mainContent.collectByCurrUser = !topicCommon.mainContent.collectByCurrUser
      }
    },
    favorSuccessHandler: function (id) {
      let topcWenti = this.wenti.find(e => e.mainContent.id === id)
      let topicSystem = this.jinhuaTopic.find(e => e.mainContent.id === id)
      let topicCommon = this.commonTopic.find(e => e.mainContent.id === id)
      if (topcWenti) {
        let isfavor = topcWenti.mainContent.favorByCurrUser
        topcWenti.mainContent.favorByCurrUser = !isfavor
        topcWenti.mainContent.favorCount = isfavor ? topcWenti.mainContent.favorCount - 1 : topcWenti.mainContent.favorCount + 1
      } else if (topicSystem) {
        let isfavor = topicSystem.mainContent.favorByCurrUser
        topicSystem.mainContent.favorByCurrUser = !isfavor
        topicSystem.mainContent.favorCount = isfavor ? topicSystem.mainContent.favorCount - 1 : topicSystem.mainContent.favorCount + 1
      } else if (topicCommon) {
        let isfavor = topicCommon.mainContent.favorByCurrUser
        topicCommon.mainContent.favorByCurrUser = !isfavor
        topicCommon.mainContent.favorCount = isfavor ? topicCommon.mainContent.favorCount - 1 : topicCommon.mainContent.favorCount + 1
      }
    },
    followSuccessHandler: function (creatorAccount) {
      this.jinhuaTopic.forEach(e => {
        if (+e.mainContent.creatorAccount === +creatorAccount) {
          e.mainContent.follow = !e.mainContent.follow
        }
      })
      this.commonTopic.forEach(e => {
        if (+e.mainContent.creatorAccount === +creatorAccount) {
          e.mainContent.follow = !e.mainContent.follow
        }
      })
    },
    deleteSuccessHandler: function (id) {
      let topcWenti = this.wenti.find(e => e.mainContent.id === id)
      let topicCommon = this.commonTopic.find(e => e.mainContent.id === id)
      if (topcWenti) {
        topcWenti.mainContent.deleted = true
      } else if (topicCommon) {
        topicCommon.mainContent.deleted = true
      }
    },
    goOtherTopic: function (item) {
      if (+item.mainContent.id === +this.user.id) {
        this.$router.push('/myTopic')
      } else {
        this.$router.push({
          name: 'otherTopic',
          query: {
            userId: item.mainContent.creatorAccount,
            nickName: item.mainContent.nickName,
            photoUrl: item.mainContent.photoUrl
          }
        })
      }
    },
    renderText: renderText,
    getDateDiff: getDateDiff,
    getNumDiff: getNumDiff,
    fetchImg
  },
  created () {
    getTopicList(++this.pageNum, this.getTopicListSuccess, err => console.log(err))
    Bus.$on('publishSuccess', this.publishSuccessHandler)
    Bus.$on('commentSuccess', this.commentSuccessHandler)
    Bus.$on('collectSuccess', this.collectSuccessHandler)
    Bus.$on('favorSuccess', this.favorSuccessHandler)
    Bus.$on('followSuccess', this.followSuccessHandler)
    Bus.$on('deleteSuccess', this.deleteSuccessHandler)
  },
  mounted () {
    document.getElementsByClassName('index-shequ-container')[0].onscroll = this.scrollHandler
  },
  destoryed () {
    document.getElementsByClassName('index-shequ-container')[0].onscroll = null
  },
  components: {
    LoadMore
  }
}
</script>
