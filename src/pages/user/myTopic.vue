<template>
  <div class="myTopic">
    <x-header :left-options="{backText: ''}">我的话题</x-header>
      <div class="myTopic-container">
        <div class="myTopic-wrap">
          <div @click="goDetail(item)" v-for="(item, index) in myTopic" :key="'myTopic' + index" v-if="!item.mainContent.deleted" class="myTopic-item">
            <div class="fenge-15"></div>
            <div class="myTopic-header">
              <span>{{getDateDiff(item.mainContent.createTime)}}</span>
              <div>
                <img v-if="item.mainContent.type1 == 1749" class="jinghua-icon" src="../../assets/jing.png">
                <div @click.stop="deleteMyTopic(item)">
                  <img class="delete-icon" v-if="!item.mainContent.isDeleteing" :src="deleteIcon">
                  <inline-loading v-if="item.mainContent.isDeleteing"></inline-loading>
                </div>
              </div>
            </div>
            <div class="myTopic-content">
              <h2>{{renderText(item.mainContent.title1)}}</h2>
              <p>{{renderText(item.mainContent.abstractText)}}</p>
            </div>
            <div class="myTopic-bottom">
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
import './myTopic.less'
import { XHeader, InlineLoading, LoadMore } from 'vux'
import { getMyTopicList, favorContent, collectContent, deleteMyTopic } from '../../api/topic'
import { Toast } from 'mint-ui'
import { getDateDiff, renderText, getNumDiff } from '../../common/index'
import { Bus } from '../../common/bus.js'

export default {
  name: 'myTopic',
  data: function () {
    return {
      deleteIcon: require('../../assets/lajixiang.png'),
      collectedBtn: require('../../assets/yishoucang.png'),
      uncollectedBtn: require('../../assets/shoucang-.png'),
      favorBtn: require('../../assets/yizan.png'),
      unfavorBtn: require('../../assets/zan.png'),
      myTopic: [],
      fetching: true,
      nomore: false,
      pageNum: 0
    }
  },
  computed: {
    loadTip: function () {
      return this.nomore ? '没有更多了' : this.fetching ? '正在加载' : '加载更多'
    }
  },
  methods: {
    getMyTopicListSuccess: function (res) {
      res.contentList.reduce((myTopic, item) => {
        item.mainContent.isDeleteing = false
        item.mainContent.deleted = false
        myTopic.push(item)
        return myTopic
      }, this.myTopic)
      this.fetching = false
      this.nomore = res.contentList.length < 10
    },
    getMyTopicListFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
      this.fetching = false
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
    deleteMyTopicSuccess: function (item, res) {
      item.mainContent.deleted = true
      Bus.$emit('deleteSuccess', item.mainContent.id)
    },
    deleteMyTopicFail: function (item, err) {
      item.mainContent.isDeleteing = false
      console.log(err)
    },
    deleteMyTopic: function (item) {
      if (item.mainContent.isDeleteing) {
        return
      }
      let topicIds = []
      topicIds.push(item.mainContent.id)
      item.mainContent.isDeleteing = !item.mainContent.isDeleteing
      deleteMyTopic(topicIds, this.deleteMyTopicSuccess.bind(this, item), this.deleteMyTopicFail.bind(this, item))
    },
    loadMore: function () {
      if (this.fetching || this.nomore) {
        return
      }
      this.fetching = true
      getMyTopicList(++this.pageNum, this.getMyTopicListSuccess, this.getMyTopicListFail)
    },
    scrollHandler: function () {
      let wrap = document.getElementsByClassName('myTopic-container')[0]
      let content = document.getElementsByClassName('myTopic-wrap')[0]
      let scrollTop = wrap.scrollTop
      let wrapHeight = wrap.offsetHeight
      let contentHeight = content.offsetHeight
      let heightDiff = contentHeight - wrapHeight
      if (scrollTop >= heightDiff - 10) {
        this.loadMore()
      }
    },
    getDateDiff,
    renderText,
    getNumDiff
  },
  created () {
    getMyTopicList(++this.pageNum, this.getMyTopicListSuccess, this.getMyTopicListFail)
  },
  mounted () {
    document.getElementsByClassName('myTopic-container')[0].onscroll = this.scrollHandler
  },
  destoryed () {
    document.getElementsByClassName('myTopic-container')[0].onscroll = null
  },
  components: {
    XHeader,
    InlineLoading,
    LoadMore
  }
}
</script>
