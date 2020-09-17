<template>
  <v-app light>
    <template>
      <v-card color="blue lighten-2">
        <v-card-title class="headline blue lighten-1">Cadastrar Usuário</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            color="white"
            hide-no-data
            hide-selected
            item-text="Description"
            item-value="API"
            placeholder="Digite o e-mail do novo usuário"
            prepend-icon="mdi-email-search"
            return-object
            solo
          ></v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <v-expand-transition>
          <v-select
            :items="this.roles"
            item-text="text"
            item-value="value"
            v-model="newUser.role"
            label="Papel"
            solo v-if="this.model != null"
          ></v-select>
        </v-expand-transition>
        <v-divider></v-divider>
        <v-card-text>
          <v-autocomplete
            v-model="modelFarms"
            :items="farms"
            :loading="isLoadingFarms"
            :search-input.sync="searchFarms"
            color="white"
            hide-no-data
            hide-selected
            item-text="Description"
            item-value="API"
            placeholder="Digite o nome da propriedade"
            prepend-icon="mdi-image-search"
            return-object
            solo v-if="this.newUser.role != null"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!modelFarms" color="success darken-3" @click="saveNewUser">
            Salvar
            <v-icon right>mdi-check-circle</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!model" color="grey darken-3" @click="model = null; items = [];modelFarms = null; farms = [];">
            Limpar formulário
            <v-icon right>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-app>
</template>
<script>
import axios from 'axios'
export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    listFarms: [],
    isLoading: false,
    isLoadingFarms: false,
    model: null,
    modelFarms: null,
    search: null,
    searchFarms: null,
    roles: [{ value: 'owner', text: 'Proprietário' }, { value: 'manager', text: 'Gerente' }, { value: 'viewer', text: 'Visualizador' }],
    newUser: {}
  }),

  computed: {
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    fieldsFarms () {
      if (!this.modelFarms) return []

      return Object.keys(this.modelFarms).map((key) => {
        return {
          key,
          value: this.modelFarms[key] || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        const Description =
          entry.email.length + entry.name.length > this.descriptionLimit ? entry.email : entry.name + ' - ' + entry.email

        return Object.assign({}, entry, { Description })
      })
    },
    farms () {
      return this.listFarms.map((farm) => {
        const Description =
          farm.name.length > this.descriptionLimit ? '#' + farm.code + ' - ' + farm.name.slice(0, this.descriptionLimit) + '...' : '#' + farm.code + ' - ' + farm.name

        return Object.assign({}, farm, { Description })
      })
    }
  },

  watch: {
    search (val) {
      // Items have already been loaded
      if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true
      const user = this.$session.get('user')
      // Lazily load input items
      axios.get(process.env.VUE_APP_CLOUD + '/manager/users/' + this.search, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        // this.count = response.data.length
        this.entries = response.data
      }).catch((err) => {
        console.log(err)
      }).finally(() => (this.isLoading = false))
    },
    searchFarms (val) {
      // Items have already been loaded
      if (this.farms.length > 0) return

      // Items have already been requested
      if (this.isLoadingFarms) return

      this.isLoadingFarms = true
      const user = this.$session.get('user')
      // Lazily load input items
      axios.get(process.env.VUE_APP_CLOUD + '/manager/farms/' + this.searchFarms, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        console.log(response.data)
        this.listFarms = response.data
      }).catch((err) => {
        console.log(err)
      }).finally(() => (this.isLoadingFarms = false))
    }
  },
  methods: {
    saveNewUser () {
      const user = this.$session.get('user')
      this.newUser.email = this.model.email
      this.newUser.farm = this.modelFarms._id
      axios.post(process.env.VUE_APP_CLOUD + '/manager/new-user', this.newUser, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        console.log(response)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
