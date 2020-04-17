<template>
  <b-list-group-item>
    <span>{{ fullItemName }}</span>
    <br />
    <span class="mr-4">{{ cartItem.amount }}x {{ $helpers.formatPrice(gym.settings, price.salesPrice) }} = {{ totalAmount }}</span>
  </b-list-group-item>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    cartItem: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['gym', 'priceById', 'itemById']),

    price() {
      return this.priceById(this.cartItem.priceId)
    },

    item() {
      return this.itemById(this.price.item)
    },

    fullItemName() {
      if (this.price.name && this.price.name.length > 0) {
        return `${this.item.name}: ${this.price.name}`
      } else {
        return this.item.name
      }
    },

    totalAmount() {
      return this.$helpers.formatPrice(this.gym.settings, this.price.salesPrice * this.cartItem.amount)
    },
  },
}
</script>
