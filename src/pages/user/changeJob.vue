<template>
  <div class="changeJob">
    <x-header :left-options="{backText: ''}">修改职业</x-header>
    <div class="changeJob-container">
      <mt-field label="职业：" placeholder="请输入新的职业" v-model="job"></mt-field>
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
import './changeJob.less'

export default {
  name: 'changeJob',
  data: function () {
    return {
      job: '',
      user: {},
      enableChangeIcon: require('../../assets/querenxiugai.png'),
      disableChangeIcon: require('../../assets/querenxiugai-hui.png')
    }
  },
  computed: {
    couldChange: function () {
      return _.trim(this.job) !== ''
    }
  },
  watch: {
    job: function () {
      this.user.job = this.job
    }
  },
  methods: {
    ...mapActions([
      'changeUserInfo'
    ]),
    getUser: function (res) {
      Indicator.close()
      this.user = res.user
      this.job = res.user.job
    },
    updateUserInfoSuccess: function (res) {
      console.log(res)
      this.changeUserInfo(this.user)
      setCookie(USER, JSON.stringify(this.user), 'd30')
      Toast({
        message: '职业修改成功！',
        position: 'bottom',
        duration: 2000
      })
      this.$router.go(-1)
    },
    updateUserInfoFail: function (err) {
      console.log(err)
    },
    updateUserInfo: function () {
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
