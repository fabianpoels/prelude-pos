<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="12" lg="8">
        <transaction-card v-for="(transaction, index) in orderedTransactions" :key="index" :transaction="transaction" accordion="transaction-accordion" />
      </b-col>
    </b-row>
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseLayout from '@/components/shared/BaseLayout'
import TransactionCard from '@/components/transaction/TransactionCard'
export default {
  components: {
    BaseLayout,
    TransactionCard,
  },

  computed: {
    ...mapGetters(['orderedTransactions']),
  },
}
</script>
