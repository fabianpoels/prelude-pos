<template>
  <b-card :title="fullname" :sub-title="customer.address.town" class="h-100" footer-bg-variant="white">
    <account-item v-for="accountItem in customerAccount.prices" :key="accountItem.id" :accountItem="accountItem" />
    <hr />
    <div class="d-flex flex-row justify-content-between mt-2">
      <div>{{ $t('sidebar.total') }}</div>
      <div>{{ $helpers.formatPrice(gym.settings, totalForCustomerAccount(customerAccount)) }}</div>
    </div>
    <template #footer>
      <div class="d-flex flex-row w-75 ml-auto">
        <b-btn variant="success" class="mr-2 w-50" :disabled="accountItemsCount < 2">
          <font-awesome-icon :icon="['fas', 'hand-holding-usd']" size="2x" />
          <font-awesome-icon :icon="['fas', 'users']" size="2x" />
        </b-btn>
        <b-btn variant="success" class="w-50">
          <font-awesome-icon :icon="['fas', 'hand-holding-usd']" size="2x" />
          <font-awesome-icon :icon="['fas', 'user']" size="2x" />
        </b-btn>
      </div>
    </template>
  </b-card>
</template>
<script>
import { mapGetters } from 'vuex'
import AccountItem from '@/components/customerAccount/AccountItem'
export default {
  components: {
    AccountItem,
  },

  computed: {
    ...mapGetters(['customerById', 'gym', 'totalForCustomerAccount', 'customerAccountItemsCount']),

    accountItemsCount() {
      return this.customerAccountItemsCount(this.customerAccount)
    },

    customer() {
      return this.customerById(this.customerAccount.customer.toString())
    },

    fullname() {
      return `${this.customer.firstname} ${this.customer.lastname}`
    },
  },

  props: {
    customerAccount: {
      type: Object,
      required: true,
    },
  },
}
</script>
<style scoped>
.account-card {
  cursor: pointer !important;
}
</style>
