<template>
  <div>
    <top-bar>
      <b-button v-if="showSetupButton" variant="warning" size="lg" v-b-modal.SetupModal>{{ $t('topbar.setup') }}</b-button>
      <b-button v-if="showAddUserButton" variant="warning" size="lg" v-b-modal.AddFirstUserModal>{{ $t('topbar.add_first_user') }}</b-button>
      <b-button v-if="!connected" variant="warning" size="lg" :disabled="connecting" @click="reconnect()">
        {{ connectText }}
        <b-spinner small v-if="connecting"></b-spinner>
      </b-button>
    </top-bar>
    <setup-modal :uuid="$store.state.ApplicationStore.posUuid" />
    <add-first-user-modal />
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@/components/topbar/TopBar'
import SetupModal from '@/components/setup/SetupModal'
import AddFirstUserModal from '@/components/setup/AddFirstUserModal'
export default {
  name: 'main-view',

  components: {
    TopBar,
    SetupModal,
    AddFirstUserModal,
  },

  computed: {
    ...mapGetters(['showSetupButton', 'connecting', 'connected', 'gym', 'pos', 'users']),

    connectText() {
      return this.connecting ? `${this.$i18n.t('topbar.connecting')}...` : this.$i18n.t('topbar.retry_connection')
    },

    showAddUserButton() {
      return this.connected && this.gym && this.gym._id && this.pos && this.pos._id && this.users.length === 0
    },
  },

  methods: {
    reconnect() {
      this.$emit('reconnect')
    },
  },
}
</script>
<style scoped></style>
