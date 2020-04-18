<template>
  <b-list-group-item>
    <b-row>
      <b-col cols="9">
        <div class="h6">{{ fullItemName }}</div>
        <div class="ml-3">{{ cartItem.amount }} x {{ $helpers.formatPrice(gym.settings, price.salesPrice) }}</div>
      </b-col>
      <b-col cols="3" class="d-flex justify-content-end">
        <div class="align-self-end">{{ totalAmount }}</div>
      </b-col>
    </b-row>
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
