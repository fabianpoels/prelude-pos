<template>
  <div class="p-3 mt-3">
    <b-row class="p-2">
      <b-col cols="9" class="d-flex justify-content-end">
        <div class="h6">{{ $t('sidebar.total') }}</div>
      </b-col>
      <b-col cols="3" class="d-flex justify-content-end border-left">
        <div>{{ $helpers.formatPrice(gym.settings, totalAmount) }}</div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    totalAmount: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['gym']),
  },
}
</script>
