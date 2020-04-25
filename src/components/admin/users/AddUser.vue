<template>
  <b-modal v-model="showModal" id="addUserModal" :title="$t('user.add_user')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="firstname" :label="$t('user.firstname')" label-for="firstname-input">
        <b-form-input id="firstname-input" v-model="newUser.firstname" required :disabled="saving" />
      </b-form-group>
      <b-form-group id="lastname" :label="$t('user.lastname')" label-for="lastname-input">
        <b-form-input id="lastname-input" v-model="newUser.lastname" required :disabled="saving" />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('user.login')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="newUser.identifier" required :disabled="saving" />
      </b-form-group>
      <b-form-group :label="$t('user.role')" label-for="role-input">
        <b-form-select id="role-input" v-model="newUser.role" :options="roleOptions" :disabled="saving" />
      </b-form-group>
      <b-form-group id="password" :label="$t('user.password')" label-for="password-input">
        <b-form-input id="password-input" v-model="newUser.password" required type="password" :disabled="saving" />
      </b-form-group>
      <b-form-group id="passwordConfirm" :label="$t('user.confirm_password')" label-for="passwordConfirm-input">
        <b-form-input id="passwordConfirm-input" v-model="newUser.passwordConfirm" required type="password" :disabled="saving" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="createNewUser()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
import config from '@/config/config'
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  data: function() {
    return {
      showModal: false,
      saving: false,
      newUser: {},
    }
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.newUser = this.blankUser()
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'gyms']),

    validInput() {
      return (
        this.newUser.identifier &&
        this.newUser.identifier.length > 0 &&
        this.newUser.password &&
        this.newUser.password.length > 0 &&
        this.newUser.passwordConfirm &&
        this.newUser.password === this.newUser.passwordConfirm
      )
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
    blankUser() {
      return {
        firstname: '',
        lastname: '',
        identifier: '',
        role: config.user.roles.employee,
      }
    },

    async createNewUser() {
      this.saving = true
      await this.$store.dispatch('createUser', { user: { ...this.newUser }, gym: this.gym })
      this.$bvToast.toast(`${this.newUser.firstname} ${this.newUser.lastname}`, {
        title: this.$i18n.t('forms.user.user_added'),
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
