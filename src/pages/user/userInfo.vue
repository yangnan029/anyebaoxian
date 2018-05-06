<template>
  <div class="userInfo">
    <x-header :left-options="{backText: ''}">我的信息</x-header>
    <router-link to="/changePhone">
      <user-info-item :value="user.phone" name="手机绑定"/>
    </router-link>
    <img class="fengetiao" src="../../assets/fengetiao.png" alt=""/>
    <user-info-item :value="renderPhoto" name="头像"/>
    <router-link to="/changeNickName">
      <user-info-item :value="user.nickName" name="昵称"/>
    </router-link>
    <img class="fengetiao" src="../../assets/fengetiao.png" alt=""/>
    <div class="relative">
      <user-info-item :value="userSex" name="性别"/>
      <popup-radio on-hide="test()" title="性别" :options="[{key:'1',value:'男'},{key:'2',value:'女'}]" v-model="user.sex"></popup-radio>
    </div>
    <router-link to="/changeJob">
      <user-info-item :value="user.job" name="职业"/>
    </router-link>
    <div class="relative">
      <user-info-item :value="address" name="地址"/>
      <popup-picker @change="changeCity" :data="cityData" :columns="2" placeholder="请选择城市" title="城市：" v-model="cityValue"/>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from '../../common/cookie.js'
import { TOKEN, USER, fetchImg } from '../../common/index.js'
import { getUserInfo, updateUserInfo } from '../../api/userInfo.js'
import { Indicator, Toast } from 'mint-ui'
import { XHeader, Group, PopupRadio, PopupPicker } from 'vux'
import { mapActions } from 'vuex'
import UserInfoItem from '../../components/userInfoItem.vue'
import './userInfo.less'
import { upload } from '../../api/upload.js'
import _ from 'lodash'
const cityData = require('../../common/cityData.min.json')

export default {
  name: 'userInfo',
  data: function () {
    return {
      user: {},
      cityData: cityData,
      cityValue: [],
      defaultPhoto: require('../../assets/xuanzetouxiang.png'),
      morentouxiang: require('../../assets/touxiang.png'),
      cityInited: false
    }
  },
  computed: {
    userSex: function () {
      if (this.user.sex === '1') {
        return '男'
      } else if (this.user.sex === '2') {
        return '女'
      } else {
        return ''
      }
    },
    address: function () {
      return this.cityValue.join(' ')
    }
  },
  watch: {
    user: {
      handler: function (val, oldval) {
        oldval.id && this.updateUserInfo()
      },
      deep: true
    },
    cityValue: {
      handler: function (val, oldval) {
        setTimeout(() => {
          this.cityInited = !!oldval[0]
        })
        this.cityInited && this.updateUserInfo()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'changeUserInfo'
    ]),
    getUser: function (res) {
      Indicator.close()
      this.user = res.user
      this.user.sex += ''
      this.cityValue = [this.user.province, this.user.city]
    },
    getUserFail: function (res) {
      Indicator.close()
      this.$router.replace('login')
      Toast({
        message: res.message,
        position: 'middle',
        duration: 2000
      })
    },
    renderPhoto: function (h) {
      return (
        <div class="userPhoto">
          <input on-change={this.uploadImg} type="file" name="" ref="fileinput" class="fileinput"/>
          <img src={this.fetchImg(this.user.photoUrl)} alt=""/>
        </div>
      )
    },
    uploadSuccesss: function (res) {
      console.log(res)
      this.user.photoUrl = res.photoPath
    },
    uploadFail: function (err) {
      console.log(err)
    },
    uploadImg: function (e) {
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('headPhotoFile', file)
      let isImg = /^(\s|\S)+(gif|jpeg|tif|jpg|png)+$/i.test(e.target.value)
      if (isImg) {
        upload(formData, this.uploadSuccesss, this.uploadFail)
      } else {
        Toast({
          message: '只能选择图片哦！',
          position: 'middle',
          duration: 2000
        })
      }
    },
    changeCity: function () {
      this.user.province = this.cityValue[0]
      this.user.city = this.cityValue[1]
    },
    updateUserInfo: function () {
      let user = _.cloneDeep(this.user)
      delete user.deviceToken
      delete user.id
      delete user.phone
      updateUserInfo(user, this.updateUserInfoSuccess, this.updateUserInfoFail, true)
    },
    updateUserInfoSuccess: function (res) {
      console.log(res)
      this.changeUserInfo(this.user)
      setCookie(USER, JSON.stringify(this.user), 'd30')
    },
    updateUserInfoFail: function (err) {
      console.log(err)
    },
    fetchImg
  },
  components: {
    XHeader,
    UserInfoItem,
    Group,
    PopupRadio,
    PopupPicker
  },
  beforeMount: function () {
    if (!getCookie(TOKEN)) {
      this.$router.replace('login')
      return
    }
    Indicator.open()
    getUserInfo(this.getUser, this.getUserFail)
  }
}
</script>
