<template>
  <div class="d-flex flex-row justify-content-between">
    <div>{{ accountItem.amount }} x {{ fullItemName }}</div>
    <div>{{ totalAmount }}</div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['gym', 'itemById', 'priceById']),

    fullItemName() {
      if (this.price.name && this.price.name.length > 0) {
        return `${this.item.name}: ${this.price.name}`
      } else {
        return this.item.name
      }
    },

    item() {
      return this.itemById(this.price.item.toString())
    },

    price() {
      return this.priceById(this.accountItem.price.toString())
    },

    totalAmount() {
      return this.$helpers.formatPrice(this.gym.settings, this.price.salesPrice * this.accountItem.amount)
    },
  },

  props: {
    accountItem: {
      type: Object,
      required: true,
    },
  },
}
</script>
