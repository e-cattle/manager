import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'

Vue.use(VueAxios, axios)

Vue.use(VueAuthenticate, {
  baseUrl: process.env.VUE_APP_CLOUD + '/manager',

  providers: {
    google: {
      tokenPath: 'token',
      clientId: process.env.VUE_APP_GOOGLE,
      scope: ['email', 'profile']
    },
    facebook: {
      clientId: process.env.VUE_APP_FACEBOOK
    }
  }
})
