// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/common.css'
import './styles/element-ui.css'
// import './mock' // simulation data
import App from './App'
import router from './router'
import store from './store'
import request from '@/utils/request'
import './permission'
import './assets/font/iconfont.css'
import echarts from 'echarts'
import * as filters from './filter' // global filters
import { getCookie } from '@/utils/cookie'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = request
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$echarts = echarts
Vue.prototype.api = process.env.NODE_ENV === 'development' ? 'https://shaangutestapi.yunweiyan.com/manage' : 'https://shaangutestapi.yunweiyan.com/manage'
// Vue.prototype.api = process.env.NODE_ENV === 'development' ? 'http://192.168.1.170:9009/manage' : 'http://shaangutestapi.yunweiyan.com/manage'
// Vue.prototype.commonApi = process.env.NODE_ENV === 'development' ? 'http://shaangutestapi.yunweiyan.com/common' : 'http://shaangutestapi.yunweiyan.com/common'
Vue.prototype.commonApi = process.env.NODE_ENV === 'development' ? 'https://shaangutestapi.yunweiyan.com/common' : 'https://shaangutestapi.yunweiyan.com/common'
Vue.prototype.upload = process.env.NODE_ENV === 'development' ? 'https://shaangutestapi.yunweiyan.com' : 'https://shaangutestapi.yunweiyan.com'
Vue.prototype.appUrl = process.env.NODE_ENV === 'development' ? 'https://shaangutestapi.yunweiyan.com/app' : 'https://shaangutestapi.yunweiyan.com/app'
Vue.prototype.token = getCookie('user_info') ? JSON.parse(getCookie('user_info')).token : ''
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
