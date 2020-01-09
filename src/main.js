import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueSessionStorage from 'vue-sessionstorage'
import GSignInButton from 'vue-google-signin-button'
import FBSignInButton from 'vue-facebook-signin-button'

Vue.use(VueSessionStorage)

Vue.use(FBSignInButton)
Vue.use(GSignInButton)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')

// console.log('Meu teste: ' + process.env.VUE_APP_GOOGLE)
