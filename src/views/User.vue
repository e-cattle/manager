<template>
  <v-app light>
    <template>
      <v-card>
        <v-card-title class="headline">Cadastrar Usuário</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newUser.nome"
            prepend-icon="mdi-cursor-text"
            append-icon="mdi-close"
            @click:append="newUser.nome = null"
            label="Digite o nome do novo usuário"
            required
            ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="newUser.email"
            :rules="emailRules"
            prepend-icon="mdi-email"
            append-icon="mdi-close"
            @click:append="newUser.email = null"
            label="Digite o e-mail do novo usuário"
            required
            ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-select
            :items="this.roles"
            item-text="text"
            item-value="value"
            v-model="newUser.role"
            prepend-icon="mdi-account-circle"
            label="Papel"
            solo
            required
          ></v-select>
        </v-card-text>
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
            solo
            required
            >
            <v-icon slot="append" color="dark" @click="modelFarms = null">
              mdi-close
            </v-icon>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!modelFarms && !newUser.role && !newUser.email" color="warning darken-3" @click="newUser.role = null; modelFarms = null; farms = []; newUser.email = null;">
            Limpar formulário
            <v-icon right>mdi-close-circle</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!modelFarms || !newUser.role || !newUser.email" color="success darken-3" @click="saveNewUser">
            Salvar
            <v-icon right>mdi-check-circle</v-icon>
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
    listFarms: [],
    isLoadingFarms: false,
    modelFarms: null,
    searchFarms: null,
    roles: [{ value: 'owner', text: 'Proprietário' }, { value: 'manager', text: 'Gerente' }, { value: 'viewer', text: 'Visualizador' }],
    newUser: {},
    emailRules: [
      v => !!v || 'O campo e-mail é obrigatório',
      v => /.+@.+/.test(v) || 'Por favor, insira um e-mail válido'
    ]
  }),

  computed: {
    fieldsFarms () {
      if (!this.modelFarms) return []

      return Object.keys(this.modelFarms).map((key) => {
        return {
          key,
          value: this.modelFarms[key] || 'n/a'
        }
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
    searchFarms (val) {
      if (this.farms.length > 0) return
      if (this.isLoadingFarms) return
      this.isLoadingFarms = true
      const user = this.$localStorage.get('user')
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
      const user = this.$localStorage.get('user')
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
