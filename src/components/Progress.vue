<template>
  <v-dialog v-model="wait" persistent max-width="300px">
    <v-card class="pa-5">
      <v-card-text style="text-align: center;">
        <v-progress-circular :size="size" indeterminate :color="color" />
      </v-card-text>
      <v-card-title class="headline" block style="text-align: center;">
        {{ message }}
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @module components/Progress
 * @description Este componente abre um dialog de barra de progresso, quando chamado o método openProgress.
 * @example <progress message="teste" color="teal" :size="30" ref="progr"></progress>
 * @vue-prop {String} message - Mensagem de espera.
 * @vue-prop {String} color - Cor da barra de progresso
 * @vue-prop {Number} size - Tamanho da barra de progresso
 */
export default {
  props: {
    message: String,
    color: String,
    size: Number
  },
  data () {
    return {
      wait: false
    }
  },
  methods: {
    /**
     * @example this.$refs.progr.openProgress()
     */
    openProgress () {
      this.wait = true
    },
    closeProgress () {
      this.wait = false
    }
  }
}
</script>
