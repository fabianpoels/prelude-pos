<template>
  <div class="p-2">
    <b-input-group class="d-flex flex-nowrap justify-content-end">
      <b-input-group-prepend class="flex-grow-1">
        <b-input-group-text class="w-100 descirption">{{ description }}</b-input-group-text>
      </b-input-group-prepend>
      <b-input-group-prepend>
        <b-input-group-text>{{ $helpers.formatPrice(gym.settings, price.salesPrice) }}</b-input-group-text>
      </b-input-group-prepend>
      <b-input-group-append>
        <b-btn variant="primary" @click="addOne()">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </b-btn>
        <b-input-group-text style="width: 3em; text-align: center;">{{ cartItem.amount }}</b-input-group-text>
        <b-btn variant="primary" @click="removeOne()" :disabled="cartItem.amount === 1">
          <font-awesome-icon :icon="['fas', 'minus']" />
        </b-btn>
        <b-btn variant="danger" @click="removeFromCart()">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-btn>
      </b-input-group-append>
    </b-input-group>
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
  },

  computed: {
    ...mapGetters(['gym', 'priceById', 'itemById']),

    price() {
      return this.priceById(this.cartItem.priceId)
    },

    item() {
      return this.itemById(this.price.item.toString())
    },

    description() {
      if (this.price.name && this.price.name.length > 0) {
        return `${this.item.name}: ${this.price.name}`
      } else {
        return this.item.name
      }
    },
  },

  methods: {
    addOne() {
      this.$store.commit('addToCart', this.cartItem.priceId)
    },

    removeOne() {
      this.$store.commit('removeOneFromCart', this.cartItem.priceId)
    },

    removeFromCart() {
      this.$store.commit('removeFromCart', this.cartItem.priceId)
    },
  },
}
</script>
<style scoped>
.description {
  max-width: 275px !important;
}
</style>
