<template>
  <b-col cols="5" class="d-flex flex-column justify-content-between">
    <div class="d-flex flex-column">
      <split-checkout-item v-for="(cartItem, index) in cartItems" :key="index" :cartItem="cartItem" :direction="direction" @moveAll="moveAll(cartItem)" @moveOne="moveOne(cartItem)" />
    </div>
    <div>
      <checkout-total :totalAmount="totalForCartItems(cartItems)" />
    </div>
  </b-col>
</template>
<script>
import { mapGetters } from 'vuex'
import CheckoutTotal from '@/components/checkout/_CheckoutTotal'
import SplitCheckoutItem from '@/components/checkout/_SplitCheckoutItem'
export default {
  components: {
    CheckoutTotal,
    SplitCheckoutItem,
  },

  props: {
    cartItems: {
      type: Array,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['totalForCartItems']),

    left() {
      return this.direction === 'left'
    },

    right() {
      return this.direction === 'right'
    },
  },

  methods: {
    moveAll(cartItem) {
      if (this.left) {
        this.$store.dispatch('moveFullItemLeft', cartItem)
      } else if (this.right) {
        this.$store.dispatch('moveFullItemRight', cartItem)
      }
    },

    moveOne(cartItem) {
      if (this.left) {
        this.$store.dispatch('moveOneLeft', cartItem)
      } else if (this.right) {
        this.$store.dispatch('moveOneRight', cartItem)
      }
    },
  },
}
</script>
