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
                {{ error }}
              </v-alert>
              <v-layout align-center justify-center row wrap v-if="agree" class="px-1">
                <v-flex xs12 sm12 md6 lg6 xl6 class="px-1 my-1" style="text-align: center;">
                  <g-signin-button :params="googleSignInParams" @success="onSignInSuccessGoogle" @error="onSignInErrorGoogle" block>
                    <v-icon dark left class="mx-2 my-0">fab fa-google</v-icon>
                    Google
                  </g-signin-button>
                </v-flex>
                <v-flex xs12 sm12 md6 lg6 xl6 class="px-1 my-1" style="text-align: center;">
                  <fb-signin-button :params="facebookSignInParams" @success="onSignInSuccessFacebook" @error="onSignInErrorFacebook" block>
                    <v-icon dark left class="mx-2 my-0">fab fa-facebook</v-icon>
                    Facebook
                  </fb-signin-button>
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

// require('../library/facebook.js')

export default {
  components: {
    TextDialog
  },
  data () {
    return {
      facebookSignInParams: {
        scope: 'email,public_profile',
        return_scopes: true
      },
      googleSignInParams: {
        client_id: process.env.VUE_APP_GOOGLE
      },
      privacy: '',
      details: '',
      agree: false,
      wait: false,
      error: false
    }
  },
  computed: {
    providers: function () {
      return this.all.filter(function (e) {
        if (String(process.env['VUE_APP_' + e.name]).trim().length > 0) {
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
    onSignInSuccessFacebook (facebook) {
      console.log('#1 - Success to sign in Facebook!')

      // console.log(JSON.stringify(facebook))

      this.wait = true

      this.login(facebook.authResponse.accessToken, 'Facebook')
    },
    onSignInErrorFacebook (error) {
      console.log(error)

      this.error = 'Ops! Ocorreu um erro ao tentar autenticá-lo(a)! Por favor, tente novamente mais tarde.'

      this.wait = false

      throw new Error(error)
    },
    onSignInSuccessGoogle (google) {
      console.log('#1 - Success to sign in Google!')

      // console.log(JSON.stringify(google))

      this.wait = true

      this.login(google.getAuthResponse(true).access_token, 'Google')
    },
    onSignInErrorGoogle (error) {
      console.log(error)

      this.error = 'Ops! Ocorreu um erro ao tentar autenticá-lo(a)! Por favor, tente novamente mais tarde.'

      this.wait = false

      throw new Error(error)
    },
    login (token, driver) {
      console.log('Driver: ' + driver)
      console.log('Token: ' + token)
      /*
      var self = this

      var err = function (error) {
        console.log(error)

        if (error !== null && typeof error === 'object' &&
        error.response !== null && typeof error.response !== 'undefined' &&
        error.response.data !== null && typeof error.response.data !== 'undefined') {
          console.log(JSON.stringify(error.response.data))
        }

        self.wait = false

        self.error = 'Ops! Ocorreu um erro ao tentar autenticá-lo(a)! Por favor, tente novamente mais tarde.'

        self.$err(error)
      }

      var timestamp = Math.floor(ts.now())

      console.log('Timestamp for sync is ' + timestamp + ' and refers ' + ts.toDate(timestamp))

      var appID = this.settings.app
      var appPK = this.settings.token

      var appSignature = crypto.HmacSHA1(timestamp + appID, appPK)

      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-embrapa-auth-timestamp': timestamp,
        'x-embrapa-auth-application-id': appID,
        'x-embrapa-auth-application-signature': appSignature
      }

      var secret = '' + crypto.MD5(appPK + timestamp)
      secret = secret.substr(0, 16)

      console.log('#2 - Trying to connect in remote server...')

      axios.get(settings.api + '/status', { timeout: 2000, mode: 'no-cors', headers: headers }).then(function (response) {
        console.log('#3 - Registering or logging in instance and getting Titan\'s private key...')

        var tk = blowfish.blowfish.encrypt(token, secret, { cipherMode: 0, outputType: 0 })

        var data = {
          driver: driver,
          token: tk,
          device: self.mobile.osName + ' ' + self.mobile.osVersion + ' (' + self.mobile.browserName + ' ' + self.mobile.browserVersion + ')'
        }

        axios.post(settings.api + '/register', query.stringify(data), { mode: 'no-cors', headers: headers }).then(response => {
          var clientID = response.data.id
          var clientPK = blowfish.blowfish.decrypt(response.data.pk, secret, { cipherMode: 0, outputType: 0 })

          console.log('ID: ' + clientID)
          console.log('PK: ' + clientPK)

          var clientSignature = crypto.HmacSHA1(timestamp + clientID, clientPK)

          var headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'x-embrapa-auth-timestamp': timestamp,
            'x-embrapa-auth-application-id': appID,
            'x-embrapa-auth-application-signature': appSignature,
            'x-embrapa-auth-client-id': clientID,
            'x-embrapa-auth-client-signature': clientSignature
          }

          console.log('#4 - Getting user data from instance...')

          axios.get(settings.api + '/auth', { mode: 'no-cors', headers: headers }).then(function (response) {
            console.log('#5 - Encoding picture to Base64...')

            image2base64(settings.api.slice(0, -3) + 'titan.php?target=script&toSection=manager&file=picture&user=' + response.data.id + '&width=200').then(picture => {
              console.log('#6 - Saving all data in local DB...')

              console.log(picture)

              self.$localStorage.set('token', {
                id: clientID,
                pk: clientPK
              })

              self.$localStorage.set('user', {
                authenticated: true,
                id: response.data.id,
                name: response.data.name,
                email: response.data.mail,
                picture: picture,
                language: response.data.language,
                timezone: response.data.timezone
              })

              // settings.api.slice (0, -3) + 'titan.php?target=script&toSection=manager&file=picture&user=' + response.data.id + '&width=200'

              self.$root.$data.trySync = true

              if (self.mobile.isMobile) {
                self.$localStorage.set('alwaysSync', false)
              }

              self.wait = false

              console.log('#6 - All done! Redirecting...')

              self.$router.push({ path: '/home' })
            }).catch(err)
          }).catch(err)
        }).catch(err)
      }).catch(error => {
        console.log(error)

        self.$err(error)

        self.wait = false

        self.error = 'Atenção! O servidor remoto parece estar indisponível. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde.'
      })
      */
    },
    loadFiles () {
      var p = '../privacy-policy.html'
      var d = '../details.html'

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
