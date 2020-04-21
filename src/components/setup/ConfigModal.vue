<template>
  <b-modal v-model="showModal" id="configModal" :title="$t('setup.configure_connection')" body-bg-variant="100">
    <b-form-group id="connectionMode" :label="$t('setup.connection_mode')" label-for="mode-input">
      <b-form-radio v-model="localDbConfig.connectionMode" name="mode-input" value="standard">{{ $t('setup.standard') }}</b-form-radio>
      <b-form-radio v-model="localDbConfig.connectionMode" name="mode-input" value="custom">{{ $t('setup.custom') }}</b-form-radio>
    </b-form-group>
    <b-form class="my-3">
      <template v-if="localDbConfig.connectionMode === 'standard'">
        <b-form-group id="host" :label="$t('setup.host')" label-for="host-input">
          <b-form-input id="host-input" v-model="localDbConfig.host" required :placeholder="$t('setup.hostname')" />
        </b-form-group>
        <b-form-group id="database" :label="$t('setup.database')" label-for="database-input">
          <b-form-input id="database-input" v-model="localDbConfig.db" required :placeholder="$t('setup.database')" />
        </b-form-group>
        <b-form-group id="password" :label="$t('setup.password')" label-for="password-input">
          <b-form-input id="password-input" v-model="localDbConfig.password" required type="password" />
        </b-form-group>
        <b-form-group id="user" :label="$t('setup.user')" label-for="user-input">
          <b-form-input id="user-input" v-model="localDbConfig.user" required :placeholder="$t('setup.username')" />
        </b-form-group>
      </template>
      <template v-else-if="localDbConfig.connectionMode === 'custom'">
        <b-form-group id="connectionString" :label="$t('setup.host')" label-for="connectionString-input">
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text>mongodb://</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input id="connectionString-input" v-model="localDbConfig.connectionString" required placeholder="user:password@host/db" />
          </b-input-group>
        </b-form-group>
      </template>
    </b-form>
    <div slot="modal-footer">
      <save-button :disabled="!formComplete" :saving="saving" @click="saveConfig()" :saveText="$t('setup.connecting')">{{ $t('setup.connect') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SaveButton from './../shared/SaveButton'
export default {
  props: {
    restartOnSave: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    SaveButton,
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      localDbConfig: {},
    }
  },

  watch: {
    showModal(value) {
      if (value) this.localDbConfig = { ...this.dbConfig }
    },
  },

  computed: {
    ...mapGetters(['dbConfig']),

    formComplete() {
      return (
        this.localDbConfig &&
        this.localDbConfig.host &&
        this.localDbConfig.host.length > 0 &&
        this.localDbConfig.db &&
        this.localDbConfig.db.length > 0 &&
        this.localDbConfig.password &&
        this.localDbConfig.password.length > 0 &&
        this.localDbConfig.user &&
        this.localDbConfig.user.length > 0
      )
    },
  },

  methods: {
    async saveConfig() {
      this.saving = true
      this.$store.dispatch('saveConfig', this.localDbConfig)
      if (this.restartOnSave) {
        await this.$store.dispatch('startApplication')
        this.$bvToast.toast(this.$i18n.t('setup.connected_to', { database: this.dbConfig.db }), {
          title: this.$i18n.t('setup.connected'),
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center',
        })
      }
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
