<template>
  <b-modal no-close-on-backdrop id="loginModal" v-model="showModal" :title="$t('login.login')">
    <b-form class="my-3" @keydown.enter="login">
      <b-form-group id="identifier" :label="$t('login.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="identifier" required />
      </b-form-group>
      <b-form-group id="password" :label="$t('login.password')" label-for="password-input">
        <b-form-input id="password-input" v-model="password" required type="password" />
      </b-form-group>
    </b-form>
    <div slot="modal-footer">
      <save-button :disabled="!(identifier.length > 0 && password.length > 0)" :saving="loggingIn" @click="login()" :savingText="$t('login.logging_in')">{{ $t('login.login') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  watch: {
    showModal() {
      this.identifier = ''
      this.password = ''
    },
  },

  data() {
    return {
      loggingIn: false,
      identifier: '',
      password: '',
      showModal: false,
    }
  },

  methods: {
    async login() {
      this.loggingIn = true
      let loggedIn = await this.$store.dispatch('login', { identifier: this.identifier, password: this.password })
      if (loggedIn) {
        if (this.$route.name !== 'root') this.$router.push({ name: 'root' })
        this.loggingIn = false
        this.showModal = false
      } else {
        this.loggingIn = false
      }
    },
  },
}
</script>
