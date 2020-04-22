<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="8" lg="4" class="d-flex flex-column align-items-center">
        <b-btn variant="success" v-b-modal.configModal class="my-3 py-3 w-100" :disabled="connecting">
          <span class="h2 mr-2">{{ $t('setup.configure_connection') }}</span>
          <font-awesome-icon v-if="configLoaded && connected" :icon="['fas', 'check']" size="2x" />
        </b-btn>
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-down']" size="4x" />
        <b-btn v-b-modal.setupGymModal :variant="gymLoaded ? 'success' : 'secondary'" :disabled="!connected || connecting" class="my-3 py-3 w-100">
          <span class="h2 mr-2">{{ $t('setup.setup_gym') }}</span>
          <font-awesome-icon v-if="gymLoaded" :icon="['fas', 'check']" size="2x" />
        </b-btn>
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-down']" size="4x" />
        <b-btn v-b-modal.createPos :variant="posLoaded ? 'success' : 'secondary'" :disabled="!connected || connecting || posLoaded || !gymLoaded" class="my-3 py-3 w-100">
          <span class="h2 mr-2">{{ $t('setup.create_pos') }}</span>
          <font-awesome-icon v-if="posLoaded" :icon="['fas', 'check']" size="2x" />
        </b-btn>
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-down']" size="4x" />
        <b-btn v-b-modal.addFirstUserModal :variant="userPresent ? 'success' : 'secondary'" :disabled="!connected || connecting || !posLoaded || userPresent" class="my-3 py-3 w-100">
          <span class="h2 mr-2">{{ $t('setup.create_first_user') }}</span>
          <font-awesome-icon v-if="userPresent" :icon="['fas', 'check']" size="2x" />
        </b-btn>
      </b-col>
    </b-row>
    <config-modal />
    <setup-gym-modal />
    <create-pos v-if="gymLoaded" />
    <add-first-user-modal />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import AddFirstUserModal from '@/components/setup/AddFirstUserModal'
import BaseLayout from '@/components/shared/BaseLayout'
import ConfigModal from '@/components/setup/ConfigModal'
import CreatePos from '@/components/setup/CreatePos'
import SetupGymModal from '@/components/setup/SetupGymModal'
export default {
  components: {
    AddFirstUserModal,
    BaseLayout,
    ConfigModal,
    CreatePos,
    SetupGymModal,
  },

  computed: {
    ...mapGetters(['gym', 'connected', 'connecting', 'configLoaded', 'posLoaded', 'gymLoaded', 'users']),

    userPresent() {
      return this.users.length > 0
    },
  },
}
</script>
