<template>
  <b-card header-bg-variant="white" footer-bg-variant="white">
    <template #header>
      <div class="d-flex flex-row justify-content-between">
        <div class="h4">{{ fullname }}</div>
        <b-btn variant="outline-secondary" v-b-modal="`viewCustomer-${customer.id}-accountPage`">
          <font-awesome-icon :icon="['fas', 'user']" />
        </b-btn>
      </div>
    </template>
    <account-item v-for="accountItem in customerAccount.accountItems" :key="accountItem.id" :accountItem="accountItem" />
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
        <b-btn variant="success" class="w-50" v-b-modal="`${customer.id}-accountSingleCheckout`">
          <font-awesome-icon :icon="['fas', 'hand-holding-usd']" size="2x" />
          <font-awesome-icon :icon="['fas', 'user']" size="2x" />
        </b-btn>
      </div>
    </template>
    <view-customer :customer="customer" modalIdSuffix="accountPage" />
    <account-single-checkout :customerAccount="customerAccount" @processed="fullyProcessed" @transferred="fullyTransferred" />
    <!-- <account-split-checkout :customerAccount="customerAccount" /> -->
  </b-card>
</template>
<script>
import { mapGetters } from 'vuex'
import AccountItem from '@/components/customerAccount/AccountItem'
import AccountSingleCheckout from '@/components/customerAccount/AccountSingleCheckout'
// import AccountSplitCheckout from '@/components/customerAccount/AccountSplitCheckout'
import ViewCustomer from '@/components/customer/ViewCustomer'
export default {
  components: {
    AccountItem,
    AccountSingleCheckout,
    // AccountSplitCheckout,
    ViewCustomer,
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

  methods: {
    fullyProcessed(transaction) {
      this.$emit('fullyProcessed', { transaction: transaction, customerAccount: this.customerAccount })
    },

    fullyTransferred(customer) {
      this.$emit('fullyTransferred', { customer: customer, customerAccount: this.customerAccount })
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
