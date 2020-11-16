import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css'
import '@/plugins/element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ZkTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
axios.defaults.baseURL='https://rambuild.cn/api/private/v1'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.component('zk-table', ZkTable)
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
