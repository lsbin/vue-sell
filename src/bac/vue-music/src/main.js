import 'babel-polyfill'// 必须写在文件的开始部分
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

// 对移动端点击延迟300毫秒的处理
fastclick.attach(document.body)

// 将懒加载插件注册在Vue中
Vue.use(VueLazyLoad, {
  // 未加载的图片的默认显示图片
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
