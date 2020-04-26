<template>
  <div>
    <b-spinner small v-if="saving" />
    <b-dropdown variant="link-secondary" no-caret v-else>
      <template v-slot:button-content>
        <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
      </template>
      <template v-if="user.enabled">
        <b-dropdown-item v-b-modal="`editUser-${user._id}`">{{ $t('form.edit') }}</b-dropdown-item>
        <b-dropdown-item v-b-modal="`resetPassword-${user._id}`">{{ $t('user.reset_password') }}</b-dropdown-item>
        <b-dropdown-item @click="enable(false)" v-if="!self">{{ $t('user.disable') }}</b-dropdown-item>
      </template>
      <b-dropdown-item v-if="!user.enabled" @click="enable(true)">{{ $t('user.enable') }}</b-dropdown-item>
      <template v-if="showDelete">
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item v-b-modal="`deleteUser-${user._id}`">{{ $t('form.delete') }}</b-dropdown-item>
      </template>
    </b-dropdown>
    <edit-user :user="user" />
    <reset-password :user="user" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import EditUser from '@/components/admin/users/EditUser'
import ResetPassword from '@/components/admin/users/ResetPassword'
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    EditUser,
    ResetPassword,
  },

  data() {
    return {
      saving: false,
    }
  },

  computed: {
    ...mapGetters(['currentUser']),

    self() {
      return this.user._id === this.currentUser._id
    },
  },

  methods: {
    async enable(enable) {
      this.saving = true
      let localUser = { ...this.user }
      localUser.enabled = enable
      await this.$store.dispatch('updateUser', localUser)
      this.saving = false
    },
  },
}
</script>
