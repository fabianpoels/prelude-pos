<template>
  <div id="app">
    <login-modal />
    <top-bar />
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginModal from '@/components/LoginModal'
import TopBar from '@/components/topbar/TopBar'
export default {
  name: 'Prelude-App',

  components: {
    LoginModal,
    TopBar,
  },

  mounted() {
    this.startApplication()
  },

  computed: {
    ...mapGetters(['connected']),
  },

  methods: {
    async startApplication() {
      let started = await this.$store.dispatch('startApplication')
      if (started) {
        this.$bvModal.show('loginModal')
      } else {
        if (!this.connected) {
          this.$bvToast.toast(this.$i18n.t('setup.connection_error_detailed'), {
            title: this.$i18n.t('setup.connection_error'),
            variant: 'danger',
            solid: true,
            toaster: 'b-toaster-top-center',
          })
        }
        if (this.$route.name !== 'setup') this.$router.push({ name: 'setup' })
      }
    },
  },
}
</script>
<style>
body,
html {
  height: 100%;
  background-color: #dee2e6 !important;
}
</style>
