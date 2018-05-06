<template>
  <div class="completeInformation">
    <h2>信息补全</h2>
    <span @click="skip()" class="skip-btn">跳过</span>
    <div class="photo-btn">
      <img :src="fetchImg(user.photoUrl)">
    </div>
    <input @change="uploadImg" type="file" name="" ref="fileinput" class="fileinput"/>
    <div class="user-detail">
      <mt-field label="昵称：" type="text" placeholder="请输入昵称" v-model="user.nickName"></mt-field>
      <mt-radio
        title="性别："
        align="right"
        v-model="user.sex"
        :options="[{
          label: '男',
          value: '1'
        }, {
          label: '女',
          value: '2'
        }]"/>
      <popup-picker @change="changeCity" :data="cityData" :columns="2" placeholder="请选择城市" title="城市：" v-model="cityValue"/>
      <div @click="updateUserInfo()" class="confirm-btn">
        <img src="../../assets/queding.png">
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { PopupPicker } from 'vux'
import { mapActions } from 'vuex'
import { upload } from '../../api/upload.js'
import { Indicator, Toast } from 'mint-ui'
import { updateUserInfo, getUserInfo } from '../../api/userInfo.js'
import {USER, TOKEN, fetchImg} from '../../common/index.js'
import {setCookie, getCookie} from '../../common/cookie.js'
import './completeInformation.less'
const cityData = require('../../common/cityData.min.json')

export default {
  name: 'completeInformation',
  data: function () {
    return {
      user: {},
      cityData: cityData,
      cityValue: [],
      defaultPhoto: require('../../assets/xuanzetouxiang.png')
    }
  },
  components: {
    PopupPicker
  },
  methods: {
    ...mapActions([
      'changeUserInfo'
    ]),
    skip: function () {
      this.$router.go(-2)
    },
    test: function () {
      console.log(this.user)
    },
    getUser: function (res) {
      Indicator.close()
      this.user = res.user
      this.user.sex = this.user.sex + ''
      this.cityValue = [this.user.province, this.user.city]
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
      let disableUpdate = _.trim(this.user.nickName) === ''
      if (disableUpdate) {
        Toast({
          message: '用户名不能为空！',
          position: 'bottom',
          duration: 3000
        })
      }
      this.changeCity()
      let user = _.cloneDeep(this.user)
      delete user.deviceToken
      delete user.id
      delete user.phone
      updateUserInfo(user, this.updateUserInfoSuccess, this.updateUserInfoFail)
    },
    updateUserInfoSuccess: function (res) {
      console.log(res)
      this.changeUserInfo(this.user)
      setCookie(USER, JSON.stringify(this.user), 'd30')
      Toast({
        message: '信息补全成功！',
        position: 'bottom',
        duration: 2000
      })
      this.$router.go(-2)
    },
    updateUserInfoFail: function (err) {
      console.log(err)
    },
    fetchImg
  },
  beforeMount: function () {
    if (!getCookie(TOKEN)) {
      this.$router.replace('login')
      return
    }
    Indicator.open()
    getUserInfo(this.getUser, () => {
      Indicator.open()
    })
  }
}
</script>
