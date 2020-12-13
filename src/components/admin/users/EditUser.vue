<template>
  <b-modal v-model="showModal" :id="`editUser-${user.id}`" :title="$t('user.edit_user')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="firstname" :label="$t('user.firstname')" label-for="firstname-input">
        <b-form-input id="firstname-input" v-model="editUser.firstname" required :disabled="saving" />
      </b-form-group>
      <b-form-group id="lastname" :label="$t('user.lastname')" label-for="lastname-input">
        <b-form-input id="lastname-input" v-model="editUser.lastname" required :disabled="saving" />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('user.login')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="editUser.identifier" required :disabled="saving" />
      </b-form-group>
      <b-form-group :label="$t('user.role')" label-for="role-input">
        <b-form-select id="role-input" v-model="editUser.role" :options="roleOptions" :disabled="saving" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="updateUser()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
import config from '@/config/config'
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      editUser: {},
    }
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.editUser = { ...this.user }
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'gyms']),

    validInput() {
      return this.editUser.identifier && this.editUser.identifier.length > 0
    },

    roleOptions() {
      return Object.keys(config.user.roles).map(r => {
        let role = config.user.roles[r]
        return {
          value: role,
          text: this.$i18n.t(`user.${role}`),
        }
      })
    },
  },

  methods: {
    async updateUser() {
      this.saving = true
      await this.$store.dispatch('updateUser', this.editUser)
      this.$bvToast.toast(`${this.editUser.firstname} ${this.editUser.lastname}`, {
        title: this.$i18n.t('user.user_updated'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.showModal = false
    },
  },
}
</script>

<style scoped></style>
