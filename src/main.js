// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css'
import './mynormalize.css'
import 'mint-ui/lib/style.css'
import 'lib-flexible/flexible'
import MintUI from 'mint-ui'
import store from './store/index'
import VueHtml5Editor from 'vue-html5-editor'
import { TOKEN } from './common/index.js'
import { getCookie } from './common/cookie.js'

Vue.config.productionTip = false
Vue.use(MintUI)
Vue.use(VueHtml5Editor, {
  language: 'zh-cn',
  image: {
    sizeLimit: 10 * 1024 * 1024,
    upload: {
      url: '/anyebaoxian-api/user/uploadHeadPhotoH5',
      headers: {
        token: getCookie(TOKEN) || ''
      },
      fieldName: 'headPhotoFile'
    },
    uploadHandler (res) {
      res = JSON.parse(res)
      if (res.code === '100000') {
        return res.data.photoPath
      }
    },
    compress: {
      width: 400,
      height: 400,
      quality: 80
    }
  },
  visibleModules: [
    'text',
    'color',
    'font',
    'align',
    'list',
    'link',
    'unlink',
    'tabulation',
    'image',
    'hr',
    'eraser',
    'undo',
    'full-screen'
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
