<template>
  <div class="sidebar pt-3 bg-light shadow-sm d-flex flex-column justify-content-between">
    <div class="cartItems h-100">
      <transition-group name="list" tag="div" class="prices">
        <cart-item v-for="cartItem in cartItems" :key="cartItem.priceId" :cartItem="cartItem" />
      </transition-group>
    </div>
    <div class="footer pb-3">
      <div>
        <hr />
      </div>
      <div class="px-3 d-flex flex-row justify-content-between">
        <span class="h3">{{ $t('sidebar.total') }}</span>
        <span class="h3">{{ $helpers.formatPrice(gym.settings, cartTotal) }}</span>
      </div>
      <div class="px-3 d-flex flex-row">
        <b-btn v-if="!cartHasItems && cartHasBackup" variant="outline-secondary" class="w-50 mr-2" @click="$store.commit('restoreCartBackup')">
          <font-awesome-icon :icon="['fas', 'undo']" size="2x" />
        </b-btn>
        <b-btn v-else variant="outline-danger" class="w-50 mr-2" :disabled="!cartHasItems" @click="$store.commit('clearCart')">
          <font-awesome-icon :icon="['fas', 'ban']" size="2x" />
        </b-btn>
        <b-btn variant="primary" class="w-100 mr-2" :disabled="!cartHasItems" v-b-modal.addToCustomerAccount>
          <font-awesome-icon :icon="['fas', 'address-book']" size="2x" />
        </b-btn>
        <b-btn variant="success" class="w-100 mr-2" :disabled="!cartHasItems || cartItemsCount < 2" v-b-modal.splitCheckout>
          <font-awesome-icon :icon="['fas', 'hand-holding-usd']" size="2x" />
          <font-awesome-icon :icon="['fas', 'users']" size="2x" />
        </b-btn>
        <b-btn variant="success" class="w-100" :disabled="!cartHasItems" v-b-modal.singleCheckout>
          <font-awesome-icon :icon="['fas', 'hand-holding-usd']" size="2x" />
          <font-awesome-icon :icon="['fas', 'user']" size="2x" />
        </b-btn>
      </div>
    </div>
    <single-checkout @processed="processed" :cartItems="cartItems" @transferred="transferred"/>
    <split-checkout v-model="splitCartItems" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CartItem from '@/components/page/sidebar/_CartItem'
import SingleCheckout from '@/components/checkout/SingleCheckout'
import SplitCheckout from '@/components/checkout/SplitCheckout'
export default {
  components: {
    CartItem,
    SingleCheckout,
    SplitCheckout,
  },

  computed: {
    ...mapGetters(['gym', 'cartHasItems', 'cartHasBackup', 'cartItems', 'cartTotal', 'cartItemsCount']),

    splitCartItems: {
      get() {
        return this.cartItems
      },
      set(items) {
        this.$store.commit('setCart', items)
      },
    },
  },

  methods: {
    processed(transaction) {
      this.$bvToast.toast(`#${transaction.number}: ${this.$helpers.formatPrice(this.gym, transaction.totalAmount)}`, {
        title: this.$i18n.t('checkout.processed'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
    },

    transferred(customer) {
      this.$bvToast.toast(`${customer.firstname} ${customer.lastname}`, {
        title: this.$i18n.t('checkout.transferred'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
    },
  },
}
</script>
<style scoped>
.sidebar {
  width: 500px;
  height: calc(100vh - 80px);
}

.prices {
  display: flex;
  flex-direction: column;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
