<template>
  <div class="publishTopic-container">
    <x-header :left-options="{backText: ''}" >
      <span @click="publishTopic" class="publishBtn" slot="right">发布</span>
      发起话题
    </x-header>
    <div class="fenge-30"></div>
    <div class="title-container">
      <input v-model="title" type="text" placeholder="请输入标题" class="title-input" name="">
    </div>
    <vue-html5-editor @change="changeContent" :content="content"></vue-html5-editor>
  </div>
</template>

<script>
import './publishTopic.less'
import 'font-awesome/css/font-awesome.min.css'
import { XHeader } from 'vux'
import { COMMONTOPIC_TYPE, TOKEN } from '../../common/index.js'
import { createContent } from '../../api/topic.js'
import { Bus } from '../../common/bus.js'
import { Toast } from 'mint-ui'
import { getCookie } from '../../common/cookie'
import router from '../../router'

import _ from 'lodash'

export default {
  name: 'publishTopic',
  data: function () {
    return {
      content: '',
      title: ''
    }
  },
  methods: {
    publishSuccess: function (res) {
      Toast({
        message: '发布成功！',
        position: 'middle',
        duration: 2000
      })
      Bus.$emit('publishSuccess')
      this.$router.go(-1)
    },
    publishFail: function (err) {
      err.message && Toast({
        message: err.message,
        position: 'middle',
        duration: 2000
      })
    },
    publishTopic: function () {
      if (!_.trim(this.title)) {
        Toast({
          message: '标题不能为空！',
          position: 'middle',
          duration: 2000
        })
      } else {
        let msg = {}
        msg.title = this.title
        msg.type = COMMONTOPIC_TYPE
        msg.content = this.content
        createContent(msg, this.publishSuccess, this.publishFail)
      }
    },
    changeContent: function (content) {
      this.content = content
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!getCookie(TOKEN)) {
      Toast({
        message: '发布话题前请先登录哦！',
        position: 'middle',
        duration: 2000
      })
      router.push('/login')
    } else {
      next()
    }
  },
  components: {
    XHeader
  }
}
</script>
