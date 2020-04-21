<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="8" lg="4" class="d-flex flex-column align-items-center">
        <b-btn variant="success" v-b-modal.configModal class="my-3 py-3 w-100">
          <span class="h2 mr-2">{{ $t('setup.configure_connection') }}</span>
          <font-awesome-icon v-if="configLoaded && connected" :icon="['fas', 'check']" size="2x" />
        </b-btn>
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-down']" size="4x" />
        <b-btn v-b-modal.setupGymModal :variant="gymLoaded ? 'success' : 'secondary'" :disabled="!connected" class="my-3 py-3 w-100">
          <span class="h2 mr-2">{{ $t('setup.setup_gym') }}</span>
          <font-awesome-icon v-if="gymLoaded" :icon="['fas', 'check']" size="2x" />
        </b-btn>
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-down']" size="4x" />
        <b-btn :variant="posLoaded ? 'success' : 'secondary'" :disabled="!connected || posLoaded || !gymLoaded" class="my-3 py-3 w-100">
          <span class="h2 mr-2">{{ $t('setup.create_pos') }}</span>
          <font-awesome-icon v-if="posLoaded" :icon="['fas', 'check']" size="2x" />
        </b-btn>
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-down']" size="4x" />
      </b-col>
    </b-row>
    <config-modal />
    <setup-gym-modal />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseLayout from '@/components/shared/BaseLayout'
import ConfigModal from '@/components/setup/ConfigModal'
import SetupGymModal from '@/components/setup/SetupGymModal'
export default {
  components: {
    BaseLayout,
    ConfigModal,
    SetupGymModal,
  },

  computed: {
    ...mapGetters(['gym', 'connected', 'connecting', 'configLoaded', 'posLoaded', 'gymLoaded']),
  },
}
</script>
