<template>
  <div class="changePhone">
    <x-header :left-options="{backText: ''}">修改绑定手机</x-header>
    <div class="changePhone-container">
      <mt-field label="旧手机号：" type="tel" placeholder="请输入旧手机号" v-model="oldPhone"></mt-field>
      <mt-field label="新手机号：" type="tel" placeholder="请输入新手机号" v-model="newPhone"></mt-field>
      <mt-field label="验证码：" type="tel" v-model="verification">
        <span @click="requireVerification()" :class="[couldRequireVerification ? 'verification-btn-enable' : '', 'verification-btn-disable']">发送验证码{{wattingTime > 0 ? ('(' + wattingTime + '秒)') : ''}}</span>
      </mt-field>
      <img class="changeBtn" :src="couldChange ? enableChangeIcon : disableChangeIcon" @click="updatePhone()">
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapActions } from 'vuex'
import { updatePhone } from '../../api/userInfo.js'
import { setCookie, getCookie } from '../../common/cookie.js'
import { USER, TOKEN } from '../../common/index.js'
import _ from 'lodash'
import './changePhone.less'

export default{
  name: 'changePhone',
  data: function () {
    return {
      oldPhone: '',
      newPhone: '',
      verification: '',
      enableChangeIcon: require('../../assets/querenxiugai.png'),
      disableChangeIcon: require('../../assets/querenxiugai-hui.png'),
      wattingTime: 0,
      watting: false,
      wattingTimer: undefined,
      user: {}
    }
  },
  computed: {
    couldRequireVerification: function () {
      let phoneReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
      return phoneReg.test(this.oldPhone) && phoneReg.test(this.newPhone) && !this.watting
    },
    couldChange: function () {
      let phoneReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
      return phoneReg.test(this.oldPhone) && phoneReg.test(this.newPhone) && /[0-9]{6}/.test(this.verification)
    }
  },
  methods: {
    ...mapActions([
      'changeUserInfo'
    ]),
    updatePhone: function () {
      if (!this.couldChange) {
        return
      }
      let updatePhoneMsg = {}
      updatePhoneMsg.oldPhone = this.oldPhone
      updatePhoneMsg.newPhone = this.newPhone
      updatePhoneMsg.code = this.verification
      console.log(updatePhoneMsg)
      updatePhone(updatePhoneMsg, this.updatePhoneSuccess)
      this.couldChange && console.log('ok')
    },
    updatePhoneSuccess: function (res) {
      console.log(res)
      this.user.phone = this.newPhone.substr(0, 3) + '****' + this.newPhone.substr(7)
      this.changeUserInfo(this.user)
      setCookie(USER, JSON.stringify(this.user), 'd30')
      this.$router.go(-1)
    },
    requireVerification: function () {
      if (!this.couldRequireVerification) {
        return
      }
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
    }
  },
  components: {
    XHeader
  },
  beforeMount: function () {
    this.user = _.cloneDeep(this.$store.state.user.user)
  },
  beforeCreate: function () {
    if (!getCookie(TOKEN)) {
      this.$router.replace('login')
    }
  }
}
</script>
