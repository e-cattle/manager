import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueSessionStorage from 'vue-sessionstorage'

import './auth'

Vue.use(VueSessionStorage)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
