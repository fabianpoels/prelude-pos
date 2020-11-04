<template>
  <b-navbar toggleable="lg" type="dark" variant="info" id="top-nav-bar" sticky>
    <!-- <b-collapse id="nav-collapse" is-nav></b-collapse>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->
    <b-spinner v-if="connecting" />
    <b-navbar-nav v-if="loggedIn">
      <router-link tag="b-nav-item" v-for="page in orderedPages" :key="page._id" :to="{ name: 'page-view', params: { pageId: page._id } }" class="mr-3">
        <font-awesome-icon :icon="['fas', page.icon]" size="2x" v-if="page.icon && page.icon !== ''" />
        <span class="ml-2">{{ page.name }}</span>
      </router-link>
      <router-link tag="b-nav-item" :to="{ name: 'transactions' }" class="ml-5 mr-3">
        <font-awesome-icon :icon="['fas', 'receipt']" size="2x" />
        <span class="ml-2">{{ $t('topbar.transactions') }}</span>
      </router-link>
      <router-link tag="b-nav-item" :to="{ name: 'customers' }" class="mr-3">
        <font-awesome-icon :icon="['fas', 'address-book']" size="2x" />
        <span class="ml-2">{{ $t('topbar.customers') }}</span>
      </router-link>
    </b-navbar-nav>
    <tag-read-notification v-if="loggedIn" />
    <b-navbar-nav>
      <slot></slot>
      <router-link tag="b-nav-item" :to="{ name: 'pages-setup' }" v-if="loggedIn && isAdmin" class="ml-2">
        <font-awesome-icon :icon="['fas', 'th']" size="2x" />
      </router-link>
      <b-nav-item-dropdown right v-if="loggedIn && isAdmin" class="ml-2">
        <template v-slot:button-content>
          <font-awesome-icon :icon="['fas', 'cog']" size="2x" />
        </template>
        <router-link tag="b-dropdown-item" :to="{ name: 'manage-categories' }">{{ $t('topbar.categories') }}</router-link>
        <router-link tag="b-dropdown-item" :to="{ name: 'manage-items' }">{{ $t('topbar.items') }}</router-link>
        <b-dropdown-divider></b-dropdown-divider>
        <router-link tag="b-dropdown-item" :to="{ name: 'gym-settings' }">{{ $t('topbar.settings') }}</router-link>
        <router-link tag="b-dropdown-item" :to="{ name: 'setup' }">{{ $t('setup.setup') }}</router-link>
      </b-nav-item-dropdown>
      <router-link tag="b-nav-item" :to="{ name: 'manage-users' }" class="ml-2" v-if="loggedIn && isAdmin">
        <font-awesome-icon :icon="['fas', 'users']" size="2x" />
      </router-link>
      <b-nav-item-dropdown right v-if="loggedIn" class="ml-2">
        <template v-slot:button-content>
          <font-awesome-icon :icon="['fas', 'user']" size="2x" />
        </template>
        <b-dropdown-item @click="logout()">{{ $t('topbar.logout') }}</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item right v-if="!loggedIn && dataLoaded" v-b-modal.loginModal>
        <font-awesome-icon :icon="['fas', 'user']" size="2x" />
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'
import TagReadNotification from '@/components/topbar/TagReadNotification'
export default {
  components: {
    TagReadNotification,
  },

  computed: {
    ...mapGetters(['loggedIn', 'gym', 'isAdmin', 'orderedPages', 'connected', 'connecting', 'dataLoaded']),
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push({ name: 'root' })
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
