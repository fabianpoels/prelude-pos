<template>
  <div class="shadow-sm rounded p-3 border mb-2">
    <b-row>
      <b-col cols="4" v-if="left" class="d-flex justify-content-start">
        <b-btn type="secondary" class="w-50" :disabled="cartItem.amount < 2" @click="$emit('moveAll')">
          <font-awesome-icon :icon="['fas', 'angle-double-left']" size="2x" />
        </b-btn>
        <b-btn type="secondary" class="w-50 ml-2" @click="$emit('moveOne')">
          <font-awesome-icon :icon="['fas', 'angle-left']" size="2x" />
        </b-btn>
      </b-col>
      <b-col cols="5">
        <div class="h6 text-nowrap text-truncate">{{ fullItemName }}</div>
        <div>{{ cartItem.amount }} x {{ $helpers.formatPrice(gym.settings, price.salesPrice) }}</div>
      </b-col>
      <b-col cols="3" class="d-flex justify-content-end border-left">
        <div>{{ totalAmount }}</div>
      </b-col>
      <b-col cols="4" v-if="right" class="d-flex justify-content-end">
        <b-btn type="secondary" class="w-50" @click="$emit('moveOne')">
          <font-awesome-icon :icon="['fas', 'angle-right']" size="2x" />
        </b-btn>
        <b-btn type="secondary" class="ml-2 w-50" :disabled="cartItem.amount < 2" @click="$emit('moveAll')">
          <font-awesome-icon :icon="['fas', 'angle-double-right']" size="2x" />
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    cartItem: {
      type: Object,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['gym', 'priceById', 'itemById']),

    left() {
      return this.direction === 'left'
    },

    right() {
      return this.direction === 'right'
    },

    price() {
      return this.priceById(this.cartItem.priceId)
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
      return this.$helpers.formatPrice(this.gym.settings, this.price.salesPrice * this.cartItem.amount)
    },
  },
}
</script>
