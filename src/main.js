import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

Vue.use(ElementUI)
Vue.use(ViewUI)

import '@/icons' // icon

import VueVideoPlayer from 'vue-video-player'

// require videojs style
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

Vue.use(VueVideoPlayer /* {
  options: global default options,
  events: global videojs events
} */)

Vue.config.productionTip = false

import global from '@/global/Global'
Vue.prototype.GLOBAL = global

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
