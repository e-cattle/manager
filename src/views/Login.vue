<template>
  <v-app light>
    <v-main class="background">
      <v-main fluid>
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
              <v-alert type="error" icon="mdi-alert" :value="error" transition="scale-transition" class="mx-2 my-0">
                {{ message }}
              </v-alert>

            <v-window v-model="step">
                <v-window-item class="px-3">
                  <v-btn large color="purple" class="white--text" block @click="showPrivacy">
                    <v-icon dark left>
                      mdi-gavel
                    </v-icon>Política de Privacidade
                  </v-btn>
                  <v-row wrap class="py-6">
                    <v-col xs="12" sm="6" md="6" lg="6" xl="6" class="px-3 py-0" style="text-align: left;">
                      <v-switch label="Li e aceito os termos." v-model="agree" class="mt-3 ml-3" />
                    </v-col>
                    <v-col xs="12" sm="6" md="6" lg="6" xl="6" class="px-3 py-0" style="text-align: right;">
                      <v-btn color="success" large :disabled="!agree" @click="step++" :block="$vuetify.breakpoint.xsOnly">
                        Prosseguir
                        <v-icon class="ml-2">
                          mdi-arrow-right
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-window-item>

                <v-divider v-if="step > 0" />

                <v-window-item>
                  <v-card-title class="text--center">
                    Informe seu e-Mail
                  </v-card-title>
                  <v-row wrap class="px-5">
                    <v-col
                      xs="12"
                      sm="12"
                      md="8"
                      offset-md="2"
                      lg="6"
                      offset-lg="3"
                      xl="6"
                      offset-xl="3"
                      cols="12"
                      class="px-1 pb-0"
                      style="text-align: center;"
                    >
                      <v-text-field
                        v-model="email"
                        append-icon="mdi-email"
                        outlined
                        clear-icon="mdi-close-circle"
                        clearable
                        label="e-Mail"
                        type="text"
                      />
                    </v-col>
                    <v-col xs="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" xl="6" offset-xl="3" cols="12" class="px-1 pt-0">
                      <v-radio-group v-model="reliable" :row="!$vuetify.breakpoint.xsOnly" class="py-0 my-0">
                        <template v-slot:label>
                          <div>Este dispositivo é <strong>confiável</strong>?</div>
                        </template>
                        <v-radio
                          label="Sim"
                          :value="true"
                        />
                        <v-radio
                          label="Não"
                          :value="false"
                        />
                        <template v-slot:append>
                          <v-btn text icon @click="reliableInfo()" small>
                            <v-icon>mdi-help-circle</v-icon>
                          </v-btn>
                        </template>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-btn
                      color="error"
                      text
                      @click="cancel()"
                    >
                      Cancelar
                    </v-btn>

                    <v-spacer />

                    <v-btn
                      color="success"
                      depressed
                      :disabled="!validate()"
                      large
                      @click="sendPin()"
                      :loading="loading"
                    >

                      Prosseguir
                      <v-icon class="ml-1">
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-window-item>
                 <v-window-item>
                  <v-card-title>
                    Insira o PIN
                  </v-card-title>
                  <v-card-text>
                    Um número de 6 dígitos foi enviado para o e-mail <strong>{{ email }}</strong>. Por favor, insira-o abaixo para continuar:
                  </v-card-text>
                  <div class="input-wrapper my-5" style="width: 280px; margin: 0 auto;">
                    <pincode v-model="pin" :length="6" />
                  </div>
                  <v-card-actions>
                    <v-btn
                      color="error"
                      text
                      @click="cancel()"
                    >
                      Cancelar
                    </v-btn>

                    <v-spacer />

                    <v-btn
                      color="success"
                      depressed
                      :disabled="pin.length !== 6"
                      large
                      @click="authenticate()"
                      :loading="loading"
                    >
                      Autenticar
                      <v-icon class="ml-1">
                        mdi-check
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-window-item>

              </v-window>

            </v-card>
          </v-flex>
          <v-flex xs12>
            <p class="text-xs-center my-4">
              <v-img src="../assets/embrapa.png" height="80" contain alt="Logo da Embrapa" />
            </p>
          </v-flex>
        </v-layout>
      </v-main>

    </v-main>

    <v-dialog v-model="wait" persistent max-width="240px">
      <v-card>
        <v-card-text class="pt-6" style="text-align: center;">
          <v-progress-circular indeterminate :size="70" :width="7" color="purple lighten-2"></v-progress-circular>
        </v-card-text>
        <v-card-text class="headline pb-0" style="text-align: center;">Autenticando...</v-card-text>
        <v-card-text class="title pt-0" style="text-align: center;">por favor, aguarde!</v-card-text>
      </v-card>
    </v-dialog>

    <text-dialog @consent="agree = true" @dissent="agree = false" ref="dPrivacy" />
    <text-dialog ref="dDetails" />
    <text-dialog ref="dReliable" />
    <progress-wrapper message="Autenticando... por favor, aguarde!" :size="70" color="purple lighten-2" ref="progress" />

  </v-app>

</template>

<script>
import axios from 'axios'
import TextDialog from '../components/Dialog.vue'
import ProgressWrapper from '../components/Progress.vue'
import Pincode from 'vue-pincode-input'
import md5 from 'crypto-js/md5'
import base64 from 'image-to-base64/browser'
import ErrorHelper from '@/helpers/error'

export default {
  mixins: [
    ErrorHelper
  ],
  components: {
    TextDialog, ProgressWrapper, Pincode
  },
  data () {
    return {
      step: 0,
      email: '',
      pin: '',
      reliable: null,
      rules: [
        v => !v || /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(v) || 'O e-mail precisa ser válido!'
      ],
      loading: false,
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
        var social = process.env['VUE_APP_AUTH_' + e.name.toUpperCase()]
        console.log(social)
        if (social !== undefined && social.trim().length > 0) {
          return e
        }
      })
    }
  },
  beforeCreate () {
    const user = this.$localStorage.get('user')

    if (user !== undefined && user.authenticated) {
      this.$router.push({ path: '/home' })
    }
  },
  mounted () {
    this.loadFiles()
    if (this.$localStorage.get('user') && this.$localStorage.get('user').authenticated) {
      this.$router.push({ path: '/' })
    } else if (this.$localStorage.get('email')) {
      this.agree = true
      this.reliable = true
      this.email = this.$localStorage.get('email')
      this.step = 2
    }
  },
  methods: {
    reliableInfo () {
      var text = '<p>Um <strong>dispositivo confiável</strong> é um dispositivo que <u>não seja de uso compartilhado</u>, tal como seu celular ou computador pessoal.</p>' +
        '<p>Caso esteja em um dispositivo de uso compartilhado, tal como o computador de um saguão de hotel, marque <strong>NÃO</strong> nesta opção!</p>'

      this.$refs.dPrivacy.open('Dispositivo Confiável', text, 'Ok')
    },
    validate () {
      return true
    },
    sendPin () {
      this.error = false

      if (!navigator.onLine) {
        this.message = 'É necessário uma conexão com a internet para prosseguir! Por favor, verifique suas configurações de rede ou tente novamente mais tarde.'

        this.error = true

        return
      }

      var err = error => {
        this.loading = false

        this.message = this.errorMessage(error)

        this.error = true
      }

      this.loading = true

      const api = process.env.VUE_APP_CLOUD
      const system = 'Sistema de Gestão de Inquilinos do e-Cattle'
      axios.get(api + '/status', { timeout: 2000 }).then(response => {
        axios.post(api + '/pin', { email: this.email, system: system }).then(response => {
          if (this.reliable) this.$localStorage.set('email', this.email)

          this.loading = false

          this.step++
        }).catch(err)
      }).catch(err)
    },

    authenticate () {
      this.error = false

      if (!navigator.onLine) {
        this.message = 'É necessário uma conexão com a internet para prosseguir! Por favor, verifique suas configurações de rede ou tente novamente mais tarde.'

        this.error = true

        return
      }

      var err = error => {
        this.loading = false

        this.message = this.errorMessage(error)

        this.error = true
      }

      this.loading = true

      const api = process.env.VUE_APP_CLOUD

      axios.get(api + '/status').then(response => {
        axios.post(api + '/authenticate', { email: this.email, pin: this.pin, type: 'USER' }).then(response => {
          const token = response.data.token

          axios.get(api + '/manager/user', { headers: { Authorization: 'Bearer ' + token } }).then(response => {
            var user = {
              authenticated: true,
              name: response.data.name,
              email: response.data.email,
              picture: '',
              token: token
            }

            const picture = 'https://www.gravatar.com/avatar/' + md5(response.data.email).toString() + '?s=200'
            base64(picture).then((stream) => {
              if (stream.length > 128) {
                user.picture = 'data:image/png;base64,' + stream
              }
            }).catch(() => {
              user.picture = 'data:image/png;base64,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'
            }).finally(() => {
              this.$localStorage.set('user', user)
              this.$localStorage.set('reliable', this.reliable)

              this.$localStorage.set('email', '')

              this.$router.push({ path: '/home' })
            })
          }).catch(err)
        }).catch(err)
      }).catch(err)
    },
    cancel () {
      this.step = 0
      this.$localStorage.set('email', '')

      this.error = false
      this.agree = false

      this.email = ''
      this.reliable = null

      this.pin = ''

      this.loading = false
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
.background {
  background-color: #f2f2f2;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='50' height='25' viewBox='0 0 50 25'%3E%3Cdefs%3E%3Crect stroke='%23f2f2f2' stroke-width='0.1' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='2' height='2' patternUnits='userSpaceOnUse'%3E%3Cg stroke='%23f2f2f2' stroke-width='0.1'%3E%3Crect fill='%23ededed' width='1' height='1'/%3E%3Crect fill='%23f2f2f2' width='1' height='1' x='1' y='1'/%3E%3Crect fill='%23e8e8e8' width='1' height='1' y='1'/%3E%3Crect fill='%23e3e3e3' width='1' height='1' x='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='b' width='5' height='11' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23dfdfdf'%3E%3Cuse xlink:href='%23s' x='2' y='0'/%3E%3Cuse xlink:href='%23s' x='4' y='1'/%3E%3Cuse xlink:href='%23s' x='1' y='2'/%3E%3Cuse xlink:href='%23s' x='2' y='4'/%3E%3Cuse xlink:href='%23s' x='4' y='6'/%3E%3Cuse xlink:href='%23s' x='0' y='8'/%3E%3Cuse xlink:href='%23s' x='3' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='7' height='7' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23dadada'%3E%3Cuse xlink:href='%23s' x='1' y='1'/%3E%3Cuse xlink:href='%23s' x='3' y='4'/%3E%3Cuse xlink:href='%23s' x='5' y='6'/%3E%3Cuse xlink:href='%23s' x='0' y='3'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='11' height='5' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23f2f2f2'%3E%3Cuse xlink:href='%23s' x='1' y='1'/%3E%3Cuse xlink:href='%23s' x='6' y='3'/%3E%3Cuse xlink:href='%23s' x='8' y='2'/%3E%3Cuse xlink:href='%23s' x='3' y='0'/%3E%3Cuse xlink:href='%23s' x='0' y='3'/%3E%3C/g%3E%3Cg fill='%23d5d5d5'%3E%3Cuse xlink:href='%23s' x='8' y='3'/%3E%3Cuse xlink:href='%23s' x='4' y='2'/%3E%3Cuse xlink:href='%23s' x='5' y='4'/%3E%3Cuse xlink:href='%23s' x='10' y='0'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='23' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23BA7'%3E%3Cuse xlink:href='%23s' x='2' y='5'/%3E%3Cuse xlink:href='%23s' x='23' y='13'/%3E%3Cuse xlink:href='%23s' x='4' y='18'/%3E%3Cuse xlink:href='%23s' x='35' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='61' height='31' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23BA7'%3E%3Cuse xlink:href='%23s' x='16' y='0'/%3E%3Cuse xlink:href='%23s' x='13' y='22'/%3E%3Cuse xlink:href='%23s' x='44' y='15'/%3E%3Cuse xlink:href='%23s' x='12' y='11'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='50' height='25'/%3E%3Crect fill='url(%23b)' width='50' height='25'/%3E%3Crect fill='url(%23c)' width='50' height='25'/%3E%3Crect fill='url(%23d)' width='50' height='25'/%3E%3Crect fill='url(%23e)' width='50' height='25'/%3E%3Crect fill='url(%23f)' width='50' height='25'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: repeat;
}
</style>
