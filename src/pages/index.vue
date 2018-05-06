<template>
  <div class="page-tabbar">
    <div class="page-wrap">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="财富">
          <mt-cell v-for="n in 20" :key=n :title="'餐厅 ' + n" />
        </mt-tab-container-item>
        <mt-tab-container-item id="社区">
          <keep-alive include="shequ">
            <index-shequ></index-shequ>
          </keep-alive>
        </mt-tab-container-item>
        <mt-tab-container-item id="我的">
          <div class="page-part">
            <index-user></index-user>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <mt-tabbar v-model="selected" :fixed="true">
      <mt-tab-item id="财富">
        <img slot="icon" src="../assets/caifu.png" height="90" width="90">
        财富
      </mt-tab-item>
      <mt-tab-item @click.native="setScrollTop" id="社区">
        <img slot="icon" src="../assets/shequ.png" height="90" width="90">
        社区
      </mt-tab-item>
      <mt-tab-item id="我的">
        <img slot="icon" src="../assets/wo.png" height="90" width="90">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import IndexUser from './index/wode.vue'
import IndexShequ from './index/shequ.vue'
import './index.less'

export default {
  name: 'index',
  data () {
    return {
      selected: window.sessionStorage.currentNav || '财富'
    }
  },
  methods: {
    setScrollTop: function () {
      let scrollTop = window.sessionStorage.scrollTop || 0
      setTimeout(() => {
        if (document.getElementsByClassName('index-shequ-container')[0]) {
          document.getElementsByClassName('index-shequ-container')[0].scrollTop = scrollTop
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    let scrollTop = window.sessionStorage.scrollTop || 0
    setTimeout(() => {
      if (document.getElementsByClassName('index-shequ-container')[0]) {
        document.getElementsByClassName('index-shequ-container')[0].scrollTop = scrollTop
      }
    })
    next()
  },
  components: {
    IndexUser,
    IndexShequ
  },
  watch: {
    selected: {
      handler: function () {
        window.sessionStorage.currentNav = this.selected
      }
    }
  }
}
</script>
