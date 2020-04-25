<template>
  <b-modal v-model="showModal" :id="`resetPassword-${user._id}`" :title="`${$t('user.reset_password')}: ${user.firstname} ${user.lastname}`" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="password" :label="$t('user.password')" label-for="password-input">
        <b-form-input id="password-input" v-model="editUser.password" required type="password" :disabled="saving" />
      </b-form-group>
      <b-form-group id="passwordConfirm" :label="$t('user.confirm_password')" label-for="passwordConfirm-input">
        <b-form-input id="passwordConfirm-input" v-model="editUser.passwordConfirm" required type="password" :disabled="saving" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="updateUser()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
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
        this.editUser.password = ''
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'gyms']),

    validInput() {
      return this.editUser.password && this.editUser.password.length > 0 && this.editUser.passwordConfirm && this.editUser.password === this.editUser.passwordConfirm
    },
  },

  methods: {
    async updateUser() {
      this.saving = true
      await this.$store.dispatch('changePassword', { ...this.editUser })
      this.$bvToast.toast(`${this.editUser.firstname} ${this.editUser.lastname}`, {
        title: this.$i18n.t('user.password_changed'),
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
