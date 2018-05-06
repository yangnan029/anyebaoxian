<template>
  <div class="index-user">
    <div class="user-top">
      <div class="user-edit">
        <router-link to="/userInfo">
          <img src="../../assets/bianji.png">
        </router-link>
      </div>
      <div class="user-photo-name">
        <img :src="isLogin && fetchImg(user.photoUrl) || morentouxiang">
        <router-link  v-if="!isLogin" to="/login">
          <p>去登录</p>
        </router-link>
        <p v-if="isLogin">{{isLogin && user.nickName || ''}}</p>
      </div>
    </div>
    <div class="user-menu">
      <user-item :click="logOut" name="退出登录" :icon="require('../../assets/qianbao.png')"></user-item>
      <router-link to="/myTopic">
        <user-item name="我的话题" :icon="require('../../assets/qianbao.png')"></user-item>
      </router-link>
      <router-link to="/myCollected">
        <user-item name="我的收藏" :icon="require('../../assets/qianbao.png')"></user-item>
      </router-link>
      <router-link to="/myFollow">
        <user-item name="我的关注" :icon="require('../../assets/qianbao.png')"></user-item>
      </router-link>
      <user-item name="我的收藏" :icon="require('../../assets/shoucang.png')"></user-item>
      <user-item name="我的提问" :icon="require('../../assets/tiwen.png')"></user-item>
      <user-item name="我的积分" :icon="require('../../assets/jifen.png')"></user-item>
      <user-item name="我的勋章" :icon="require('../../assets/xunzhang.png')"></user-item>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
import UserItem from '../../components/userItem.vue'
import {removeCookie, getCookie} from '../../common/cookie.js'
import {USER, TOKEN, fetchImg} from '../../common/index.js'
import './wode.less'

export default {
  data () {
    return {
      morentouxiang: require('../../assets/touxiang.png')
    }
  },
  computed: {
    isLogin () {
      return this.user.id !== undefined && getCookie(TOKEN)
    },
    user () {
      return this.$store.state.user.user
    }
  },
  components: {
    UserItem
  },
  methods: {
    logOut: function () {
      removeCookie(USER)
      removeCookie(TOKEN)
      location.reload()
    },
    fetchImg
  }
}
</script>
