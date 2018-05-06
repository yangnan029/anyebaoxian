<template>
  <div id="app">
    <keep-alive include="index">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {USER, TOKEN} from './common/index.js'
import {setCookie, getCookie} from './common/cookie.js'
import {getUserInfo} from './api/userInfo.js'

export default {
  name: 'App',
  beforeCreate: function () {
    if (!getCookie(TOKEN)) {
      return
    }
    getUserInfo((res) => {
      setCookie(USER, JSON.stringify(res.user), 'd30')
      this.$store.commit('changeUserInfo', res.user)
    })
  }
}
</script>

<style>
</style>
