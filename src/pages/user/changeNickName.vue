<template>
  <div class="changeNickName">
    <x-header :left-options="{backText: ''}">修改昵称</x-header>
    <div class="changeNickName-container">
      <mt-field label="昵称：" placeholder="请输入新的昵称" v-model="nickName"></mt-field>
      <img class="changeBtn" :src="couldChange ? enableChangeIcon : disableChangeIcon" @click="updateUserInfo()">
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapActions } from 'vuex'
import { setCookie, getCookie } from '../../common/cookie.js'
import { USER, TOKEN } from '../../common/index.js'
import { Toast, Indicator } from 'mint-ui'
import { updateUserInfo, getUserInfo } from '../../api/userInfo.js'
import _ from 'lodash'
import './changeNickName.less'

export default {
  name: 'changeNickName',
  data: function () {
    return {
      nickName: '',
      user: {},
      enableChangeIcon: require('../../assets/querenxiugai.png'),
      disableChangeIcon: require('../../assets/querenxiugai-hui.png')
    }
  },
  computed: {
    couldChange: function () {
      return _.trim(this.nickName) !== ''
    }
  },
  watch: {
    nickName: function () {
      this.user.nickName = this.nickName
    }
  },
  methods: {
    ...mapActions([
      'changeUserInfo'
    ]),
    getUser: function (res) {
      Indicator.close()
      this.user = res.user
      this.nickName = res.user.nickName
    },
    updateUserInfoSuccess: function (res) {
      console.log(res)
      this.changeUserInfo(this.user)
      setCookie(USER, JSON.stringify(this.user), 'd30')
      Toast({
        message: '昵称修改成功！',
        position: 'bottom',
        duration: 2000
      })
      this.$router.go(-1)
    },
    updateUserInfoFail: function (err) {
      console.log(err)
    },
    updateUserInfo: function () {
      let disableUpdate = _.trim(this.nickName) === ''
      if (disableUpdate) {
        Toast({
          message: '用户名不能为空！',
          position: 'bottom',
          duration: 3000
        })
      }
      let user = _.cloneDeep(this.user)
      delete user.deviceToken
      delete user.id
      delete user.phone
      updateUserInfo(user, this.updateUserInfoSuccess, this.updateUserInfoFail)
    }
  },
  components: {
    XHeader
  },
  beforeMount: function () {
    if (!getCookie(TOKEN)) {
      this.$router.replace('login')
      return
    }
    Indicator.open()
    getUserInfo(this.getUser, () => {
      Indicator.close()
    })
  }
}
</script>
