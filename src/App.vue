<template>
  <v-app light>
    <v-app-bar color="teal darken-3" dark v-if="this.$router.currentRoute.path !== '/'">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ this.$router.currentRoute.meta.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <user-wrapper @clicked="logoff" style="margin-right: -16px;"></user-wrapper>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="teal darken-1" absolute clipped temporary dark overflow>
      <p class="text-xs-center my-6">
        <v-img src="./assets/icon.png" width="250" height="120" contain alt="Logo do e-Cattle" />
      </p>
      <v-list>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item @click="go('/home')">
            <v-list-item-icon>
              <v-icon>dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Painel</v-list-item-title>
          </v-list-item>

          <v-list-item @click="go('/farm')">
            <v-list-item-icon>
              <v-icon>terrain</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Fazendas</v-list-item-title>
          </v-list-item>

          <v-list-item @click="go('/user')">
            <v-list-item-icon>
              <v-icon>group</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Usuários</v-list-item-title>
          </v-list-item>

          <v-list-item @click="go('/about')">
            <v-list-item-icon>
              <v-icon>info</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Sobre</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <p class="text-xs-center" style="position: absolute; bottom: 70px;">
        <v-img src="./assets/embrapa-white.png" width="250" height="70" contain alt="Logo da Embrapa" position-x="center" />
      </p>
    </v-navigation-drawer>

    <router-view></router-view>
  </v-app>
</template>

<script>
import UserWrapper from './components/User.vue'

export default {
  components: {
    UserWrapper
  },
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    logoff () {
      this.$session.clear()

      this.$router.push({ path: '/' })
    },
    go (path) {
      if (this.$router.currentRoute.path === path) return

      this.$router.push({ path: path })
    }
  }
}
</script>
