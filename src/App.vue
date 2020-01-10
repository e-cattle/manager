<template>
  <v-app light>
    <v-app-bar color="teal darken-3" dark v-if="this.$router.currentRoute.path !== '/'">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ this.$router.currentRoute.meta.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <user-wrapper style="margin-right: -16px;"></user-wrapper>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="teal darken-1" absolute temporary dark>
      <p class="text-xs-center my-6">
        <v-img src="./assets/logo.png" width="160" contain alt="Logo do e-Cattle" />
      </p>
      <v-list nav>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Fizz</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Buzz</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
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
  }
}
</script>
