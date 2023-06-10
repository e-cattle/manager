<template>
  <v-app light>
    <v-data-table
    :headers="headers"
    :items="farms"
    :search="search"
    sort-by="code"
    class="elevation-1">
      <template v-slot:item.active="{ item }">
        <v-chip :color="item.active ? 'green' : 'red'" dark label>{{ item.active ? 'Sim' : 'Não' }}</v-chip>
      </template>
      <template v-slot:item.created="{ item }">
        {{ item.created | formatDate }}
      </template>
      <template v-slot:item.synched="{ item }">
        {{ item.synched | formatDate }}
      </template>
      <template v-slot:item.author="{ item }">
        {{ item.author }}
      </template>
      <template v-slot:item.id="{ item }">
        <v-chip color="orange" light label class="plain" small>#{{ item.code }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="loadFarms">Recarregar</v-btn>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Sua busca por <strong>"{{ search }}"</strong> não encontrou resultados.
        </v-alert>
      </template>
      <template v-slot:footer class="row">
      <v-text-field
      v-model="search"
      append-icon="search"
      label="Buscar">
      </v-text-field>
    </template>
  </v-data-table>
  <div class="pt-2 text-right">
    <v-btn color="primary" @click="newItem()">Cadastrar Propriedade</v-btn>
  </div>
  <v-dialog v-model="dialogEditFarm" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{ editedFarm.code? "Editar Propriedade de Código " : "Cadastrar Propriedade" }}  {{ editedFarm.code }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedFarm.name" label="Nome da Propriedade"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedFarm.city" label="Cidade"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="editedFarm.state" label="Estado"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <span class="font-weight-bold">Usuários</span>
              </v-flex>
              <v-flex>
                <v-row v-for="(item, index) in editedFarm.users" :key="item.id">
                    <v-col>
                      <span class="font-weight-medium align-center">{{ item.user.name }}</span>
                    </v-col>
                    <v-col>
                      <v-select xs1 sm1 md1
                        :items="roles"
                        item-text="text"
                        item-value="value"
                        v-model="item.role"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-btn fab dark small color="warning" @click="deleteUser(index)">
                        <v-icon dark>
                          mdi-account-minus
                        </v-icon>
                      </v-btn>
                  </v-col>
                </v-row>
              </v-flex>
              <v-flex>
                <v-row>
                    <v-col md6>
                      <v-autocomplete
                        v-model="newUser"
                        :items="items"
                        :loading="isLoading"
                        :search-input.sync="searchUser"
                        color="white"
                        hide-no-data
                        hide-selected
                        item-text="Description"
                        item-value="API"
                        placeholder="E-mail do novo usuário"
                        return-object
                        solo
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-select xs1 sm1 md1
                        :items="roles"
                        item-text="text"
                        item-value="value"
                        v-model="newUser.role"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-btn fab dark small color="success" @click="addUser(newUser)">
                        <v-icon dark>
                          mdi-account-plus
                        </v-icon>
                      </v-btn>
                  </v-col>
                </v-row>
              </v-flex>
              <v-flex xs12 sm12 md12 v-if="editedFarm.code">
                <v-btn
                  :color="editedFarm.active ? 'red' : 'green'"
                  :disabled="enabling"
                  @click="editedFarm.active = !editedFarm.active"
                  text>
                  <v-icon left>{{ editedFarm.active ? 'cancel' : 'check' }}</v-icon>
                  {{ editedFarm.active ? 'Desativar Propriedade' : 'Ativar Propriedade' }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" class="white--text" @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nome',
          align: 'left',
          value: 'name'
        },
        { text: 'Cidade', value: 'city' },
        { text: 'Estado', value: 'state' },
        { text: 'ID', value: 'id' },
        { text: 'Registro', value: 'created' },
        { text: 'Sincronia', value: 'synched' },
        { text: 'Proprietário', value: 'authorName' },
        { text: 'Ativa', value: 'active' },
        { text: 'Ações', value: 'action', sortable: false }
      ],
      search: '',
      farms: [],
      dialogEditFarm: false,
      editedFarm: { users: [] },
      newUser: {},
      enabling: false,
      users: [],
      roles: [{ value: 'owner', text: 'Proprietário' }, { value: 'manager', text: 'Gerente' }, { value: 'viewer', text: 'Visualizador' }],
      isLoading: false,
      searchUser: null,
      entries: []
    }
  },
  filters: {
    formatDate (value) {
      return (value) ? moment(String(value)).format('DD/MM/YYYY hh:mm a') : ''
    }
  },
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
    items () {
      return this.entries.map((entry) => {
        const Description =
          entry.email.length + entry.name.length > this.descriptionLimit ? entry.email : entry.name + ' - ' + entry.email

        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    searchUser (val) {
      if (this.items.length > 0) return
      if (this.isLoading) return

      this.isLoading = true
      const user = this.$localStorage.get('user')
      axios.get((process.env.VUE_APP_CLOUD || 'VUE_APP_CLOUD_ARG') + '/manager/users/' + this.search, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.entries = response.data
      }).catch(() => {
        this.$alert('Erro ao carregar dados dos usuários, por favor contacte o suporte.', 'Aviso', 'warning')
      }).finally(() => (this.isLoading = false))
    }
  },
  mounted () {
    // this.loadUsers()
    this.loadFarms()
  },
  methods: {
    loadFarms () {
      const user = this.$localStorage.get('user')
      var self = this
      axios.get((process.env.VUE_APP_CLOUD || 'VUE_APP_CLOUD_ARG') + '/manager/farms', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        self.farms = response.data
      }).catch(function () {
        this.$alert('Erro ao carregar dados das propriedades, por favor contacte o suporte.', 'Aviso', 'warning')
      })
    },
    /* loadUsers () {
      const user = this.$localStorage.get('user')
      this.users = []
      axios.get(process.env.VUE_APP_CLOUD + '/manager/users', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.users = response.data
      }).catch(function (error) {
        console.log(error)
      })
    }, */
    editItem (item) {
      this.editedFarm = Object.assign({}, item)
      this.dialogEditFarm = true
    },
    newItem () {
      this.editedFarm = Object.assign({ users: [] })
      this.dialogEditFarm = true
    },
    close () {
      this.loadFarms()
      this.dialogEditFarm = false
      this.editedFarm = {}
      this.newUser = {}
    },
    save () {
      const user = this.$localStorage.get('user')
      const farm = this.editedFarm
      if (farm.code !== undefined) {
        axios.put((process.env.VUE_APP_CLOUD || 'VUE_APP_CLOUD_ARG') + '/manager/farm/' + farm.code, farm, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditFarm = false
        }).finally(() => {
          this.enabling = false
          this.loadFarms()
        })
      } else {
        axios.post((process.env.VUE_APP_CLOUD || 'VUE_APP_CLOUD_ARG') + '/manager/farm', farm, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditFarm = false
        }).finally(() => {
          this.enabling = false
          this.loadFarms()
        })
      }
      this.editedFarm = {}
    },
    deleteUser (index) {
      this.editedFarm.users.splice(index, 1)
    },
    addUser (user) {
      this.editedFarm.users.push({ role: user.role, user: user })
      this.newUser = {}
    }
    /*,
    enable (farm) {
      this.enabling = true
      const user = this.$localStorage.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/farm/' + farm.code, { active: true }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        farm.active = true
      }).finally(() => {
        this.enabling = false
      })
    },
    disable (farm) {
      this.enabling = true
      const user = this.$localStorage.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/farm/' + farm.code, { active: false }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        farm.active = false
      }).finally(() => {
        this.enabling = false
      })
    } */
  }
}
</script>

<style scoped>
.plain {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bolder;
}
</style>
