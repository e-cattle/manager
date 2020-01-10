<template>
  <v-app light>
    <v-content>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <p class="text-xs-center my-6">
              <v-img src="../assets/logo.png" height="240" contain alt="Logo do e-Cattle" />
            </p>
          </v-flex>
          <v-flex xs12 sm12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3 class="my-3">
            <v-card class="px-3 py-2">
              <v-card-title primary-title>
                <div class="headline">Sistema de Gestão de Inquilinos do e-Cattle</div>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="showDetails">
                  <v-icon color="primary">info</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <p>
                  O e-Cattle é uma plataforma de IoT para a pecuária de corte, possibilitando que propriedades, frigoríficos e outros
                  atores da cadeia de produção possam coletar dados sensoriais, higienizá-los e segmentá-los conforme seu valor semântico e,
                  posteriormente, disponibilizá-los para serem consumidos por aplicações de alto nível que resolvem problemas do domínio
                  de negócio.
                </p>
                <p>
                  Este sistema permite gerir os inquilinos da plataforma em nuvem do e-Cattle, ou seja, cadastrar e modificar
                  propriedades rurais que podem enviar dados sensoriais para a nuvem para serem consumidos por aplicativos remotos.
                </p>
                <p>
                  Somente usuários gestores da plataforma podem efetuar login neste sistema. Os dados pessoais cadastrados poderão ser utilizados,
                  sempre de forma anônima, em futuras pesquisas científicas para criação de tecnologias inovadoras para a agropecuária.
                </p>
              </v-card-text>

              <v-btn @click.stop="showPrivacy" large color="purple" class="white--text" block>
                <v-icon dark left>gavel</v-icon>
                Política de Privacidade
              </v-btn>

              <v-switch label="Li e aceito os termos." v-model="agree" class="mt-3"></v-switch>

              <v-alert type="error" icon="warning" :value="error" transition="scale-transition" class="mx-1">
                {{ message }}
              </v-alert>
              <v-layout align-center justify-center row wrap v-if="agree" class="px-1">
                <v-flex xs12 sm12 md6 lg6 xl6 v-for="provider in providers" :key="provider.name" class="px-1" style="text-align: center;">
                  <v-btn large :color="provider.color" @click="authenticate(provider.name)" class="white--text" block>
                    <v-icon dark left v-html="provider.icon"></v-icon>
                    {{ provider.label }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <p class="text-xs-center my-4">
              <v-img src="../assets/embrapa.png" height="80" contain alt="Logo da Embrapa" />
            </p>
          </v-flex>
        </v-layout>
      </v-container>

    </v-content>

    <v-dialog v-model="wait" persistent max-width="240px">
      <v-card>
        <v-card-text class="pt-6" style="text-align: center;">
          <v-progress-circular indeterminate :size="70" :width="7" color="purple lighten-2"></v-progress-circular>
        </v-card-text>
        <v-card-text class="headline pb-0" style="text-align: center;">Autenticando...</v-card-text>
        <v-card-text class="title pt-0" style="text-align: center;">por favor, aguarde!</v-card-text>
      </v-card>
    </v-dialog>

    <text-dialog @consent="agree = true" @dissent="agree = false" ref="dPrivacy"></text-dialog>
    <text-dialog ref="dDetails"></text-dialog>
  </v-app>

</template>

<script>
import axios from 'axios'
import TextDialog from '../components/Dialog.vue'

require('../plugins/facebook.js')

export default {
  components: {
    TextDialog
  },
  data () {
    return {
      privacy: '',
      details: '',
      agree: false,
      wait: false,
      error: false,
      message: '',
      all: [
        { name: 'google', label: 'Google', icon: 'fab fa-google', color: 'red darken-3' },
        { name: 'facebook', label: 'facebook', icon: 'fab fa-facebook', color: 'indigo darken-4' },
        { name: 'twitter', label: 'twitter', icon: 'fab fa-twitter', color: 'light-blue' },
        { name: 'instagram', label: 'instagram', icon: 'fab fa-instagram', color: 'pink' },
        { name: 'linkedin', label: 'linkedin', icon: 'fab fa-linkedin', color: 'blue-grey' },
        { name: 'microsoft', label: 'microsoft', icon: 'fab fa-microsoft', color: 'blue' }
      ]
    }
  },
  computed: {
    providers: function () {
      return this.all.filter(function (e) {
        if (process.env['VUE_APP_' + e.name.toUpperCase()] !== undefined && String(process.env['VUE_APP_' + e.name.toUpperCase()]).trim().length > 0) {
          return e
        }
      })
    }
  },
  beforeCreate () {
    const user = this.$session.get('user')

    if (user !== undefined && user.authenticated) {
      this.$router.push({ path: '/home' })
    }
  },
  mounted () {
    this.loadFiles()
  },
  methods: {
    authenticate (provider) {
      this.error = false
      this.wait = true

      var self = this

      console.log('Provider: ' + provider)

      this.$auth.authenticate(provider).then(function (response) {
        console.log('Access Token: ' + response.data.token)

        var token = response.data.token

        axios.get(process.env.VUE_APP_CLOUD + '/manager/user', { headers: { Authorization: 'Bearer ' + token } }).then((response) => {
          console.log(JSON.stringify(response.data))

          self.$session.set('user', {
            authenticated: true,
            name: response.data.name,
            email: response.data.email,
            picture: response.data.picture,
            token: token
          })

          self.wait = false

          self.$router.push({ path: '/home' })
        }).catch(function (error) {
          self.wait = false
          self.error = true
          self.message = 'Você possui um usuário válido, porém não tem permissões de acessar esta área de gestão!'

          console.log(JSON.stringify(error))
        })
      }).catch(function (error) {
        self.wait = false
        self.error = true
        self.message = 'Não foi possível cadastrar ou recuperar seu usuário!'

        console.log(JSON.stringify(error))
      })
    },
    loadFiles () {
      var p = '../privacy-policy.html'
      var d = '../info.html'

      var self = this

      axios.get(p).then(
        function (r) {
          self.privacy = r.data
        })

      axios.get(d).then(
        function (r) {
          self.details = r.data
        })
    },
    showPrivacy () {
      this.$refs.dPrivacy.open('Política de Privacidade', this.privacy, 'Aceito', 'Não Aceito')
    },
    showDetails () {
      this.$refs.dDetails.open('Mais Informações', this.details, 'Fechar')
    }
  }
}
</script>
<style>
.g-signin-button,
.fb-signin-button {
  display: inline-block;
  width: 100%;
  padding: 0px;
  border-radius: 3px;
  cursor: pointer;
}
.g-signin-button i,
.fb-signin-button i {
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
}
.g-signin-button {
  background-color: #C62828;
  color: #fff;
}
.fb-signin-button {
  background-color: #4267b2;
  color: #fff;
}
</style>
