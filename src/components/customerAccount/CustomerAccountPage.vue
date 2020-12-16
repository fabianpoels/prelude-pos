<template>
  <div class="p-3">
    <div class="row">
      <div class="col-3" v-for="customerAccount in customerAccounts" :key="customerAccount.id">
        <customer-account-card :customerAccount="customerAccount" />
      </div>
    </div>
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
    ...mapGetters(['customerAccounts']),
  },
}
</script>
