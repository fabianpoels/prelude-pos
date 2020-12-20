<template>
  <div class="p-3">
    <transition-group name="list" tag="div" class="row">
      <div class="col-3" v-for="customerAccount in customerAccounts" :key="customerAccount.id">
        <customer-account-card :customerAccount="customerAccount" @fullyProcessed="fullyProcessed" @fullyTransferred="fullyTransferred" />
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerAccountCard from '@/components/customerAccount/CustomerAccountCard'
export default {
  components: {
    CustomerAccountCard,
  },

  computed: {
    ...mapGetters(['customerAccounts', 'gym']),
  },

  methods: {
    fullyProcessed({ transaction, customerAccount }) {
      this.$bvToast.toast(`#${transaction.number}: ${this.$helpers.formatPrice(this.gym, transaction.totalAmount)}`, {
        title: this.$i18n.t('checkout.processed'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.$store.dispatch('deleteCustomerAccount', customerAccount)
    },

    fullyTransferred({ customer, customerAccount }) {
      this.$bvToast.toast(`${customer.firstname} ${customer.lastname}`, {
        title: this.$i18n.t('checkout.transferred'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.$store.dispatch('deleteCustomerAccount', customerAccount)
    },
  },
}
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
