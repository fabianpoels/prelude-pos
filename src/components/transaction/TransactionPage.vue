<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="12" lg="8">
        <div v-for="(transaction, index) in orderedTransactions" :key="index" class="mb-3">
          {{ transaction }}
        </div>
      </b-col>
    </b-row>
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseLayout from '@/components/shared/BaseLayout'
export default {
  components: {
    BaseLayout,
  },

  computed: {
    ...mapGetters(['orderedTransactions']),
  },
}
</script>
