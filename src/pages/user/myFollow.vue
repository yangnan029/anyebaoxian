<template>
  <div class="myFollow">
    <x-header :left-options="{backText: ''}">我的关注</x-header>
    <div class="myFollow-wrap">
      <div class="myFollow-container">
        <div class="fenge-15"></div>
        <swipeout>
          <div @click="goOtherTopic(item)" v-for="(item, index) in myFollow" :key="'myFollow' + index" v-if="item.followed">
            <swipeout-item :sensitivity="15" :right-menu-width="160" transition-mode="follow">
              <div slot="content" class="myFollow-item">
                <img :src="fetchImg(item.photoUrl)">
                <span>{{renderText(item.nickName)}}</span>
              </div>
              <div slot="right-menu">
                <swipeout-button @click.native.stop="cancelFollowUser(item)" :width="80" type="warn">取消关注</swipeout-button>
                <swipeout-button :width="80">收起</swipeout-button>
              </div>
            </swipeout-item>
            <div class="fenge-10"></div>
          </div>
        </swipeout>
        <load-more @click.native="loadMore" :show-loading="fetching" :tip="loadTip"></load-more>
      </div>
    </div>
  </div>
</template>

<script>
import './myFollow.less'
import { XHeader, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { getFollowList, followUser } from '../../api/user.js'
import { renderText, fetchImg } from '../../common/index'
import { Toast } from 'mint-ui'
import { Bus } from '../../common/bus.js'

export default {
  name: 'myFollow',
  data: function () {
    return {
      myFollow: [],
      pageNum: 0,
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
    getFollowListSuccess: function (res) {
      this.fetching = false
      this.nomore = res.authorList.length < 10
      res.authorList.reduce((myFollow, item) => {
        item.followed = true
        this.myFollow.push(item)
        return myFollow
      }, this.myFollow)
    },
    getFollowListFail: function (err) {
      this.fetching = false
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    loadMore: function () {
      if (this.fetching || this.nomore) {
        return
      }
      this.fetching = true
      getFollowList(++this.pageNum, this.getFollowListSuccess, this.getFollowListFail)
    },
    scrollHandler: function () {
      let wrap = document.getElementsByClassName('myFollow-wrap')[0]
      let content = document.getElementsByClassName('myFollow-container')[0]
      let scrollTop = wrap.scrollTop
      let wrapHeight = wrap.offsetHeight
      let contentHeight = content.offsetHeight
      let heightDiff = contentHeight - wrapHeight
      if (scrollTop >= heightDiff - 10) {
        this.loadMore()
      }
    },
    goOtherTopic: function (item) {
      this.$router.push({
        name: 'otherTopic',
        query: {
          userId: item.id,
          nickName: item.nickName,
          photoUrl: item.photoUrl
        }
      })
    },
    cancelFollowUserSuccess: function (item, res) {
      item.followed = false
      Bus.$emit('followSuccess', item.id)
    },
    cancelFollowUserFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    cancelFollowUser: function (item) {
      let msg = {}
      msg.follow = false
      msg.creatorAccount = item.id
      followUser(msg, this.cancelFollowUserSuccess.bind(this, item), this.cancelFollowUserFail)
    },
    fetchImg,
    renderText
  },
  created () {
    getFollowList(++this.pageNum, this.getFollowListSuccess, this.getFollowListFail)
  },
  mounted () {
    document.getElementsByClassName('myFollow-wrap')[0].onscroll = this.scrollHandler
  },
  destoryed () {
    document.getElementsByClassName('myFollow-wrap')[0].onscroll = null
  },
  components: {
    XHeader,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    LoadMore
  }
}
</script>
