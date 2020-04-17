<template>
  <div id="app">
    <main-view @reconnect="startApplication()" />
  </div>
</template>

<script>
import MainView from '@/components/MainView'
export default {
  name: 'prelude-pos',

  props: {
    mongo: { type: Object, required: true },
    posUuid: { type: String, required: true },
  },

  components: {
    MainView,
  },

  mounted() {
    this.startApplication()
  },

  methods: {
    startApplication() {
      this.$store
        .dispatch('initMongoConnection', {
          mongoDbHost: this.mongo.host,
          mongoDbUser: this.mongo.user,
          mongoDbPassword: this.mongo.password,
          mongoDbDatabase: this.mongo.database,
          posUuid: this.posUuid,
        })
        .then(() => {
          this.$store
            .dispatch('loadPos', this.posUuid)
            .then(async pos => {
              this.$store.commit('setGym', pos.gym)
              if (pos.gym.users) {
                this.$store.commit('setUsers', pos.gym.users)
              }
              await this.$store.dispatch('loadPosData', pos)
              this.$bvModal.show('loginModal')
            })
            .catch(error => {
              console.log(error)
              this.$store.dispatch('loadAllGyms').then(() => {
                this.$store.commit('showSetupButton', true)
              })
            })
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast('There was an error while connecting to the database', {
            title: 'Connection error',
            variant: 'danger',
            solid: true,
            toaster: 'b-toaster-top-center',
          })
        })
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
