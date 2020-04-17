<template>
  <b-modal v-model="showModal" id="AddFirstUserModal" title="Setup" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="firstname" label="Firstname" label-for="firstname-input">
        <b-form-input id="firstname-input" v-model="newUser.firstname" required />
      </b-form-group>
      <b-form-group id="lastname" label="Lastname" label-for="lastname-input">
        <b-form-input id="lastname-input" v-model="newUser.lastname" required />
      </b-form-group>
      <b-form-group id="displayname" label="Display name" label-for="displayname-input">
        <b-form-input id="displayname-input" v-model="newUser.displayname" required />
      </b-form-group>
      <b-form-group id="identifier" label="Identifier" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="newUser.identifier" required />
      </b-form-group>
      <b-form-group id="password" label="Password" label-for="password-input">
        <b-form-input id="password-input" v-model="newUser.password" required type="password" />
      </b-form-group>
      <b-form-group id="passwordConfirm" label="Confirm password" label-for="passwordConfirm-input">
        <b-form-input id="passwordConfirm-input" v-model="newUser.passwordConfirm" required type="password" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :saving="saving" @click="createNewUser()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SaveButton from './../shared/SaveButton'
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
  },

  methods: {
    blankUser() {
      return {
        firstname: '',
        lastname: '',
      }
    },

    async createNewUser() {
      this.saving = true
      await this.$store.dispatch('createFirstUser', { user: { ...this.newUser }, gym: this.gym })
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
