<template>
  <div @click="myclick()" :class="[ active ? 'active' : '','user-item']" @touchstart="focus()" @touchend="blur()">
    <div class="user-item-left">
      <img :src="icon">
      <span>{{name}}</span>
    </div>
    <div class="user-item-right">
      <img :src="active ? redArrow : blackArrow">
    </div>
  </div>
</template>

<script>
import './userItem.less'

export default {
  data () {
    return {
      blackArrow: require('../assets/jiantou.png'),
      redArrow: require('../assets/jiantou-jiaohu.png'),
      activeBG: require('../assets/bg-xuanxiang.png'),
      active: false
    }
  },
  methods: {
    focus: function () {
      this.active = true
    },
    blur: function () {
      this.active = false
    },
    myclick: function () {
      typeof this.click === 'function' && this.click()
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    click: Function
  }
}
</script>
