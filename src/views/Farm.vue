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
        <!--v-icon
          @click="deleteItem(item)"
        >
          delete
        </v-icon-->
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="loadFarms">Recarregar</v-btn>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Sua busca por <strong>"{{ search }}"</strong> não encontrou resultados.
        </v-alert>
      </template>
      <template v-slot:footer>
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
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedFarm.state" label="Estado"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="this.users"
                  item-text="name"
                  item-value="_id"
                  v-model="editedFarm.user"
                  label="Proprietário"
                  solo
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-btn
                  :color="editedFarm.active ? 'red' : 'green'"
                  :disabled="enabling"
                  @click="editedFarm.active = !editedFarm.active"
                  text>
                  <v-icon left>{{ editedFarm.active ? 'cancel' : 'check' }}</v-icon>
                  {{ editedFarm.active ? 'Desativar' : 'Ativar' }}
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
      editedFarm: {},
      enabling: false,
      users: []
    }
  },
  filters: {
    formatDate (value) {
      return (value) ? moment(String(value)).format('DD/MM/YYYY hh:mm a') : ''
    }
  },
  mounted () {
    this.loadUsers()
    this.loadFarms()
  },
  methods: {
    loadFarms () {
      const user = this.$session.get('user')
      var self = this
      axios.get(process.env.VUE_APP_CLOUD + '/manager/farms', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        console.log(response)
        self.farms = response.data
        /* self.farms.forEach(item => {
          // var index = this.users.findIndex(i => i._id === item.author)
          if (index !== -1) {
            item.owner = this.users[index].name
          } else {
            item.owner = ''
          }
        }) */
      }).catch(function (error) {
        console.log(error)
      })
    },
    loadUsers () {
      const user = this.$session.get('user')
      this.users = []
      axios.get(process.env.VUE_APP_CLOUD + '/manager/users', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.users = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    editItem (item) {
      this.editedFarm = Object.assign({}, item)
      this.dialogEditFarm = true
    },
    newItem () {
      this.editedFarm = Object.assign({})
      this.dialogEditFarm = true
    },
    deleteItem (item) {
      console.log('delete')
    },
    close () {
      this.loadFarms()
      this.dialogEditFarm = false
      this.editedFarm = {}
    },
    save () {
      const user = this.$session.get('user')
      const farm = this.editedFarm
      if (farm.code !== undefined) {
        axios.put(process.env.VUE_APP_CLOUD + '/manager/farm/' + farm.code, farm, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditFarm = false
        }).finally(() => {
          this.enabling = false
        })
      } else {
        axios.post(process.env.VUE_APP_CLOUD + '/manager/farm', farm, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditFarm = false
        }).finally(() => {
          this.enabling = false
        })
      }
      this.editedFarm = {}
      this.loadFarms()
    }/*,
    enable (farm) {
      this.enabling = true
      const user = this.$session.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/farm/' + farm.code, { active: true }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        farm.active = true
      }).finally(() => {
        this.enabling = false
      })
    },
    disable (farm) {
      this.enabling = true
      const user = this.$session.get('user')
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
