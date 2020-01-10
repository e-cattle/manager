import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Farm from '../views/Farm.vue'
import User from '../views/User.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      title: 'Painel'
    }
  },
  {
    path: '/farm',
    name: 'farm',
    component: Farm,
    meta: {
      title: 'Fazendas'
    }
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: {
      title: 'Usuários'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'Sobre'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
