<template>
  <div class="myCollected">
    <x-header :left-options="{backText: ''}">我的收藏</x-header>
    <div class="myCollected-wrap">
      <div class="myCollected-container">
        <swipeout>
          <div class="myCollected-item" @click="goDetail(item)" v-for="(item, index) in myCollected" :key="index + 'myCollected'" v-if="item.mainContent.collectByCurrUser">
            <div class="fenge-10"></div>
            <swipeout-item :sensitivity="15" :right-menu-width="240" transition-mode="follow">
              <div slot="content">
                <div class="myCollected-item-header">
                  <div @click.stop="goOtherTopic(item)" class="myCollected-item-header-left">
                    <img v-once :src="fetchImg(item.mainContent.photoUrl)"/>
                    <div>
                      <p>{{renderText(item.mainContent.nickName)}}</p>
                      <span>{{getDateDiff(item.mainContent.createTime)}}</span>
                    </div>
                  </div>
                  <div class="myCollected-item-header-right">
                    <img v-if="item.mainContent.type === 1748" class="jinghuaIcon" src="../../assets/jing.png"/>
                    <img class="guanzhuIco" v-if="user.id != item.mainContent.creatorAccount" @click.stop="followUser(item)" :src="item.mainContent.follow ? followedIcon : unFollowIcon"/>
                  </div>
                </div>
              </div>
              <div slot="right-menu">
                <swipeout-button @click.native.stop="addTag(item)" :width="80" type="primary">添加标签</swipeout-button>
                <swipeout-button @click.native.stop="collectTopic(item)" :width="80" type="warn">取消收藏</swipeout-button>
                <swipeout-button @click.native.stop="close()" :width="80">收起</swipeout-button>
              </div>
            </swipeout-item>
            <div class="myCollected-item-title">
              {{renderText(item.mainContent.title1)}}
            </div>
            <div class="myCollected-item-content">
              {{renderText(item.mainContent.abstractText)}}
            </div>
            <div class="myCollected-item-useraction">
              <div @click.stop="favorTopic(item)" class="favor">
                <img :src="item.mainContent.favorByCurrUser ? favorBtn2 : unfavorBtn2">
                <span>赞&nbsp;({{getNumDiff(item.mainContent.favorCount)}})</span>
              </div>
              <div class="comment">
                <img src="../../assets/pinglun.png">
                <span>评论&nbsp;({{getNumDiff(item.mainContent.commentCount)}})</span>
              </div>
            </div>
          </div>
        </swipeout>
        <div class="fenge-15"></div>
        <load-more @click.native="loadMore" :show-loading="fetching" :tip="loadTip"></load-more>
      </div>
    </div>
    <div class="bottom">
      <span>筛选标签</span>
      <span>管理标签</span>
    </div>
  </div>
</template>

<script>
import './myCollected.less'
import { fetchImg, renderText, getDateDiff, getNumDiff } from '../../common/index'
import { XHeader, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { getMycollected, favorContent, collectContent } from '../../api/topic'
import { followUser } from '../../api/user'
import { Bus } from '../../common/bus.js'
import { Toast } from 'mint-ui'

export default {
  name: 'myCollected',
  data: function () {
    return {
      myCollected: [],
      collectedBtn2: require('../../assets/yishoucang.png'),
      uncollectedBtn2: require('../../assets/shoucang-.png'),
      favorBtn2: require('../../assets/yizan.png'),
      unfavorBtn2: require('../../assets/zan.png'),
      followedIcon: require('../../assets/yiguanzhu.png'),
      unFollowIcon: require('../../assets/weiguanzhu.png'),
      morentouxiang: require('../../assets/touxiang.png'),
      pageNum: 0,
      fetching: true,
      nomore: false
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user.user
    },
    loadTip: function () {
      return this.nomore ? '没有更多了' : this.fetching ? '正在加载' : '加载更多'
    }
  },
  methods: {
    getMycollectedSuccess: function (res) {
      this.fetching = false
      this.nomore = res.contentList < 10
      res.contentList.reduce((myCollected, item) => {
        myCollected.push(item)
        return myCollected
      }, this.myCollected)
    },
    getMycollectedFail: function (err) {
      this.fetching = false
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
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
    followSuccess: function (item, res) {
      let isfollow = !item.mainContent.follow
      this.myCollected.forEach(e => {
        if (e.mainContent.creatorAccount === item.mainContent.creatorAccount) {
          e.mainContent.follow = isfollow
        }
      })
      Bus.$emit('followSuccess', item.mainContent.creatorAccount)
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
    loadMore: function () {
      if (this.fetching || this.nomore) {
        return
      }
      this.fetching = true
      let getMycollectedMsg = {}
      getMycollectedMsg.labelIds = []
      getMycollectedMsg.pageNum = ++this.pageNum
      getMycollected(getMycollectedMsg, this.getMycollectedSuccess, this.getMycollectedFail)
    },
    scrollHandler: function () {
      let wrap = document.getElementsByClassName('myCollected-wrap')[0]
      let content = document.getElementsByClassName('myCollected-container')[0]
      let scrollTop = wrap.scrollTop
      let wrapHeight = wrap.offsetHeight
      let contentHeight = content.offsetHeight
      let heightDiff = contentHeight - wrapHeight
      if (scrollTop >= heightDiff - 10) {
        console.log('loading...')
        this.loadMore()
      }
    },
    close: function () {
      console.log('close')
    },
    addTag: function () {
      console.log('addTag')
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
    goDetail: function (item) {
      this.$router.push('/topicDetail?id=' + item.mainContent.id)
    },
    fetchImg,
    renderText,
    getDateDiff,
    getNumDiff
  },
  created () {
    let getMycollectedMsg = {}
    getMycollectedMsg.labelIds = []
    getMycollectedMsg.pageNum = ++this.pageNum
    getMycollected(getMycollectedMsg, this.getMycollectedSuccess, this.getMycollectedFail)
  },
  mounted () {
    document.getElementsByClassName('myCollected-wrap')[0].onscroll = this.scrollHandler
  },
  destoryed () {
    document.getElementsByClassName('myCollected-wrap')[0].onscroll = null
  },
  components: {
    XHeader,
    LoadMore,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>
