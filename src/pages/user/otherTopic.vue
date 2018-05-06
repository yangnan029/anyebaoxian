<template>
  <div class="otherTopic">
    <x-header :left-options="{backText: ''}"></x-header>
    <div class="otherTopic-header">
      <img class="otherTopic-header-photo" :src="fetchImg(photoUrl)">
      <h2>{{renderText(nickNmae)}}</h2>
      <img @click="followUser" class="otherTopic-header-follow" :src="followed ? followedIcon : unFollowIcon">
      <p>丨&nbsp;&nbsp;TA的话题</p>
    </div>
    <div class="otherTopic-container">
      <div class="otherTopic-wrap">
        <div @click="goDetail(item)" v-for="(item, index) in otherTopic" :key="'otherTopic' + index" class="otherTopic-item">
          <div class="fenge-15"></div>
          <div class="otherTopic-header">
            <span>{{getDateDiff(item.mainContent.createTime)}}</span>
            <div>
              <img v-if="item.mainContent.type1 == 1749" class="jinghua-icon" src="../../assets/jing.png">
            </div>
          </div>
          <div class="otherTopic-content">
            <h2>{{renderText(item.mainContent.title1)}}</h2>
            <p>{{renderText(item.mainContent.abstractText)}}</p>
          </div>
          <div class="otherTopic-bottom">
              <div @click.stop="favorTopic(item)" class="favor">
                <img :src="item.mainContent.favorByCurrUser ? favorBtn : unfavorBtn">
                <span>赞&nbsp;({{getNumDiff(item.mainContent.favorCount)}})</span>
              </div>
              <div @click.stop="collectTopic(item)" class="collect">
                <img :src="item.mainContent.collectByCurrUser ? collectedBtn : uncollectedBtn">
                <span>收藏</span>
              </div>
              <div class="comment">
                <img src="../../assets/pinglun.png">
                <span>评论&nbsp;({{getNumDiff(item.mainContent.commentCount)}})</span>
              </div>
          </div>
        </div>
        <div class="fenge-15"></div>
        <load-more @click.native="loadMore" :show-loading="fetching" :tip="loadTip"></load-more>
      </div>
    </div>
  </div>
</template>

<script>
import './otherTopic.less'
import { XHeader, LoadMore } from 'vux'
import { getOtherTopic, favorContent, collectContent } from '../../api/topic'
import { Toast } from 'mint-ui'
import { getFollowInfo, followUser } from '../../api/user'
import { renderText, getDateDiff, getNumDiff, fetchImg } from '../../common/index'
import { Bus } from '../../common/bus.js'

export default {
  name: 'otherTopic',
  data: function () {
    return {
      pageNum: 0,
      followed: false,
      otherTopic: [],
      nickNmae: '',
      photoUrl: '',
      followedIcon: require('../../assets/yiguanzhu.png'),
      unFollowIcon: require('../../assets/weiguanzhu.png'),
      collectedBtn: require('../../assets/yishoucang.png'),
      uncollectedBtn: require('../../assets/shoucang-.png'),
      favorBtn: require('../../assets/yizan.png'),
      unfavorBtn: require('../../assets/zan.png'),
      fetching: true,
      nomore: false
    }
  },
  computed: {
    loadTip: function () {
      return this.nomore ? '没有更多了' : this.fetching ? '正在加载' : '加载更多'
    }
  },
  methods: {
    getOtherTopicSuccess: function (res) {
      res.contentList.reduce((otherTopic, item) => {
        otherTopic.push(item)
        return otherTopic
      }, this.otherTopic)
      this.nomore = res.contentList.length < 10
      this.fetching = false
    },
    getOtherTopicFail: function (err) {
      console.log(err)
    },
    getFollowInfoSuccess: function (res) {
      this.followed = res.follow
    },
    getFollowInfoFail: function (err) {
      console.log(err)
    },
    goDetail: function (item) {
      this.$router.push('/topicDetail?id=' + item.mainContent.id)
    },
    cannotFvor: function () {
      Toast({
        message: '不能给自己点赞哦！',
        position: 'middle',
        duration: 1000
      })
    },
    cannotCollect: function () {
      Toast({
        message: '不能收藏自己的哦！',
        position: 'middle',
        duration: 1000
      })
    },
    favorSuccess: function (item, res) {
      item.mainContent.favorByCurrUser = true
      item.mainContent.favorCount += 1
      Bus.$emit('favorSuccess', item.mainContent.id)
    },
    favorFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    favorTopic: function (item) {
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
      Bus.$emit('collectSuccess', item.mainContent.id)
    },
    collectFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    collectTopic: function (item) {
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
    followSuccess: function (res) {
      this.followed = !this.followed
      Bus.$emit('followSuccess', this.$route.query.userId)
    },
    followFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    followUser: function () {
      let msg = {}
      msg.follow = !this.followed
      msg.creatorAccount = this.$route.query.userId
      followUser(msg, this.followSuccess, this.followFail)
    },
    loadMore: function () {
      if (this.fetching || this.nomore) {
        return
      }
      this.fetching = true
      let getOtherTopicMsg = {}
      getOtherTopicMsg.authorId = this.$route.query.userId
      getOtherTopicMsg.pageNum = ++this.pageNum
      getOtherTopic(getOtherTopicMsg, this.getOtherTopicSuccess, this.getOtherTopicFail)
    },
    scrollHandler: function () {
      let wrap = document.getElementsByClassName('otherTopic-container')[0]
      let content = document.getElementsByClassName('otherTopic-wrap')[0]
      let scrollTop = wrap.scrollTop
      let wrapHeight = wrap.offsetHeight
      let contentHeight = content.offsetHeight
      let heightDiff = contentHeight - wrapHeight
      if (scrollTop >= heightDiff - 10) {
        this.loadMore()
      }
    },
    renderText,
    getDateDiff,
    getNumDiff,
    fetchImg
  },
  created () {
    this.nickNmae = this.$route.query.nickName
    this.photoUrl = this.$route.query.photoUrl
    let getOtherTopicMsg = {}
    getOtherTopicMsg.authorId = this.$route.query.userId
    getOtherTopicMsg.pageNum = ++this.pageNum
    getOtherTopic(getOtherTopicMsg, this.getOtherTopicSuccess, this.getOtherTopicFail)
    let getFollowInfoMsg = {}
    getFollowInfoMsg.followUserId = this.$route.query.userId
    getFollowInfo(getFollowInfoMsg, this.getFollowInfoSuccess, this.getFollowInfoFail)
  },
  mounted () {
    document.getElementsByClassName('otherTopic-container')[0].onscroll = this.scrollHandler
  },
  destoryed () {
    document.getElementsByClassName('otherTopic-container')[0].onscroll = null
  },
  components: {
    XHeader,
    LoadMore
  }
}
</script>
