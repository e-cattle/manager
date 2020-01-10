<template>
  <v-list style="background-color: rgba(255, 255, 255, 0.1);">
    <v-list-item v-if="user && user.authenticated">
      <v-list-item-avatar>
        <v-img :src="user.picture" :alt="user.name" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ user.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon>
        <v-btn icon @click="$emit('clicked')">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
      </v-list-item-icon>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.user = this.$session.get('user')
  }
}
</script>
