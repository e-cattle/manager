import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import storage from 'vue-localstorage'

Vue.use(storage, {
  name: 'localStorage',
  bind: true
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  storage,
  render: function (h) { return h(App) }
}).$mount('#app')
