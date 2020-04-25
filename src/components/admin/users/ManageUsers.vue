<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="12" lg="8">
        <default-card :title="$t('user.users')" class="my-3">
          <b-table :fields="fields" :items="tableUsers" class="my-2" v-if="users.length > 0">
            <template v-slot:cell(user)="data">
              <user-dropdown :user="data.item.user" />
            </template>
          </b-table>
          <template slot="actions">
            <div class="d-flex">
              <b-btn variant="primary" v-b-modal.addUserModal>
                <font-awesome-icon :icon="['fas', 'plus']" />
                {{ $t('user.add_user') }}
              </b-btn>
            </div>
          </template>
        </default-card>
        <default-card :title="$t('user.inactive_users')" class="my-3" v-if="inactiveTableUsers.length > 0">
          <b-table :fields="fields" :items="inactiveTableUsers" class="my-2" v-if="users.length > 0">
            <template v-slot:cell(user)="data">
              <user-dropdown :user="data.item.user" />
            </template>
          </b-table>
        </default-card>
      </b-col>
    </b-row>
    <add-user />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import AddUser from '@/components/admin/users/AddUser'
import BaseLayout from '@/components/shared/BaseLayout'
import DefaultCard from '@/components/shared/DefaultCard'
import UserDropdown from '@/components/admin/users/_UserDropdown'
export default {
  components: {
    AddUser,
    BaseLayout,
    DefaultCard,
    UserDropdown,
  },

  computed: {
    ...mapGetters(['gym', 'users']),

    fields() {
      return [
        { key: 'name', label: this.$i18n.t('user.name') },
        { key: 'login', label: this.$i18n.t('user.login') },
        { key: 'role', label: this.$i18n.t('user.role') },
        { key: 'user', label: '', tdClass: 'text-right' },
      ]
    },

    tableUsers() {
      return this.users
        .filter(u => u.enabled)
        .map(user => {
          return {
            name: `${user.firstname} ${user.lastname}`,
            login: user.identifier,
            role: this.$i18n.t(`user.${user.role}`),
            user: user,
          }
        })
    },

    inactiveTableUsers() {
      return this.users
        .filter(u => !u.enabled)
        .map(user => {
          return {
            name: `${user.firstname} ${user.lastname}`,
            login: user.identifier,
            role: this.$i18n.t(`user.${user.role}`),
            user: user,
          }
        })
    },
  },
}
</script>
