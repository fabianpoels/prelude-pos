<template>
  <b-navbar toggleable="lg" type="dark" variant="info" id="top-nav-bar" sticky>
    <!-- <b-collapse id="nav-collapse" is-nav></b-collapse>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->
    <b-navbar-nav v-if="loggedIn">
      <router-link tag="b-nav-item" v-for="page in pages" :key="page._id" :to="{ name: 'page-view', params: { pageId: page._id } }" class="mr-3">
        <font-awesome-icon :icon="['fas', page.icon]" size="2x" v-if="page.icon && page.icon !== ''" />
        <span class="ml-2">{{ page.name }}</span>
      </router-link>
      <router-link tag="b-nav-item" :to="{ name: 'transactions' }" class="ml-5 mr-3">
        <font-awesome-icon :icon="['fas', 'receipt']" size="2x" />
        <span class="ml-2">{{ $t('topbar.transactions') }}</span>
      </router-link>
    </b-navbar-nav>
    <b-navbar-nav>
      <slot></slot>
      <b-nav-item-dropdown right v-if="loggedIn && isAdmin">
        <template v-slot:button-content>
          <font-awesome-icon :icon="['fas', 'th']" size="2x" />
        </template>
        <router-link tag="b-dropdown-item" :to="{ name: 'pages-setup' }">{{ $t('topbar.setup') }}</router-link>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown right v-if="loggedIn && isAdmin" class="ml-2">
        <template v-slot:button-content>
          <font-awesome-icon :icon="['fas', 'cog']" size="2x" />
        </template>
        <router-link tag="b-dropdown-item" :to="{ name: 'manage-categories' }">{{ $t('topbar.categories') }}</router-link>
        <router-link tag="b-dropdown-item" :to="{ name: 'manage-items' }">{{ $t('topbar.items') }}</router-link>
        <b-dropdown-divider></b-dropdown-divider>
        <router-link tag="b-dropdown-item" :to="{ name: 'gym-settings' }">{{ $t('topbar.settings') }}</router-link>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown right v-if="loggedIn" class="ml-2">
        <template v-slot:button-content>
          <font-awesome-icon :icon="['fas', 'user']" size="2x" />
        </template>
        <b-dropdown-item @click="logout()">{{ $t('topbar.logout') }}</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item right v-if="!loggedIn && dataLoaded">
        <font-awesome-icon :icon="['fas', 'user']" size="2x" v-b-modal.loginModal />
      </b-nav-item>
    </b-navbar-nav>
    <login-modal />
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginModal from './LoginModal'
export default {
  name: 'top-bar',

  components: {
    LoginModal,
  },

  computed: {
    ...mapGetters(['loggedIn', 'gym', 'isAdmin', 'pages', 'connected', 'dataLoaded']),
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
  },
}
</script>

<style scoped>
#top-nav-bar {
  height: 5rem !important;
  display: flex;
  justify-content: space-between;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
