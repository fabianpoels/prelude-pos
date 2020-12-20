<template>
  <b-row class="p-2">
    <b-col cols="6">
      <div class="h6">{{ accountItem.amount }} x {{ fullItemName }}</div>
    </b-col>
    <b-col cols="3" class="d-flex justify-content-end">
      <div>{{ $helpers.formatPrice(gym.settings, price.salesPrice) }}</div>
    </b-col>
    <b-col cols="3" class="d-flex justify-content-end border-left">
      <div>{{ totalAmount }}</div>
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    accountItem: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['gym', 'priceById', 'itemById']),

    price() {
      return this.priceById(this.accountItem.price.toString())
    },

    item() {
      return this.itemById(this.price.item.toString())
    },

    fullItemName() {
      if (this.price.name && this.price.name.length > 0) {
        return `${this.item.name}: ${this.price.name}`
      } else {
        return this.item.name
      }
    },

    totalAmount() {
      return this.$helpers.formatPrice(this.gym.settings, this.price.salesPrice * this.accountItem.amount)
    },
  },
}
</script>
