<template>
  <div class="login">
    <img class="app-icon" src="../../assets/app-icon.png">
    <h2>登录</h2>
    <span class="return" @click="back()">返回</span>
    <mt-field label="手机号：" type="tel" placeholder="请输入手机号" v-model="phoneNum"></mt-field>
    <mt-field label="验证码：" type="tel" v-model="verification">
      <span @click="requireVerification()" :class="[couldRequireVerification ? 'verification-btn-enable' : '', 'verification-btn-disable']">发送验证码{{wattingTime > 0 ? ('(' + wattingTime + '秒)') : ''}}</span>
    </mt-field>
    <img class="loginBtn" :src="couldLongin ? enableLoginIcon : disableLoginIcon" @click="login()">
  </div>
</template>

<script>
import { login, requireSecurityCode } from '../../api/login.js'
import { mapActions } from 'vuex'
import { setCookie } from '../../common/cookie'
import { TOKEN, USER } from '../../common/index'
import './login.less'

export default {
  name: 'login',
  data () {
    return {
      phoneNum: '',
      verification: '',
      watting: false,
      wattingTime: 0,
      wattingTimer: undefined,
      enableLoginIcon: require('../../assets/denglu-kedianji.png'),
      disableLoginIcon: require('../../assets/denglu-anniu.png'),
      loginWatting: false
    }
  },
  computed: {
    couldRequireVerification: function () {
      return /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(this.phoneNum) && !this.watting
    },
    couldLongin: function () {
      return /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(this.phoneNum) && /[0-9]{6}/.test(this.verification)
    }
  },
  methods: {
    ...mapActions([
      'changeUserInfo'
    ]),
    back: function () {
      window.history.back()
    },
    requireVerification: function () {
      if (!this.couldRequireVerification) {
        return
      }
      requireSecurityCode({
        phone: this.phoneNum,
        type: 'login'
      })
      this.startWatting()
    },
    startWatting: function () {
      this.watting = true
      this.wattingTime = 60
      this.wattingTimer = setInterval(() => {
        this.wattingTime--
        this.wattingTime <= 0 && this.stopWatting()
      }, 1000)
    },
    stopWatting: function () {
      clearInterval(this.wattingTimer)
      this.watting = false
    },
    loginSuccess: function (res) {
      console.log(res)
      this.loginWatting = false
      this.changeUserInfo(res.user)
      setCookie(TOKEN, res.token, 'd30')
      setCookie(USER, JSON.stringify(res.user), 'd30')
      if (res.isFirstLogin === 0) {
        this.$router.push('completeInformation')
      } else {
        this.$router.go(-1)
      }
    },
    loginFail: function (err) {
      console.log(err)
      this.loginWatting = false
    },
    login: function () {
      if (!this.couldLongin && this.loginWatting) {
        return
      }
      this.loginWatting = true
      login({
        phoneNum: this.phoneNum,
        verification: this.verification
      }, this.loginSuccess, this.loginFail)
    }
  }
}
</script>
