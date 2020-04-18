<template>
  <b-modal v-model="showModal" id="splitCheckout" :title="$t('checkout.checkout')" size="xl" scrollable class="h-100">
    <b-row class="h-100">
      <b-col cols="5" class="d-flex flex-column justify-content-between">
        <div class="d-flex flex-column">
          <split-checkout-item v-for="(cartItem, index) in localCartItems" :key="index" :cartItem="cartItem" direction="right" />
        </div>
        <div>
          <checkout-total :totalAmount="totalForCartItems(localCartItems)" />
        </div>
      </b-col>
      <b-col cols="2" class="d-flex flex-column px-4 border-left border-right justify-content-center h-100">
        <b-btn variant="primary" class="mb-3" @click="moveAllRight()" :disabled="localCartItems.length === 0">
          <font-awesome-icon :icon="['fas', 'angle-double-right']" size="2x" />
        </b-btn>
        <b-btn variant="primary" @click="moveAllLeft()" :disabled="splitCartItems.length === 0">
          <font-awesome-icon :icon="['fas', 'angle-double-left']" size="2x" />
        </b-btn>
      </b-col>
      <b-col cols="5" class="d-flex flex-column justify-content-between">
        <div class="d-flex flex-column">
          <split-checkout-item v-for="(cartItem, index) in splitCartItems" :key="index" :cartItem="cartItem" direction="left" />
        </div>
        <div>
          <checkout-total :totalAmount="totalForCartItems(splitCartItems)" />
        </div>
      </b-col>
    </b-row>
    <div slot="modal-footer" class="w-50 pl-5">
      <b-overlay :show="saving" rounded="sm" class="w-100 d-flex flex-row">
        <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3 mr-2" @click="createTransaction(paymentMethods.creditCard)">
          <font-awesome-icon :icon="['fab', 'cc-visa']" size="2x" />
          <div>{{ $t('checkout.credit_card') }}</div>
        </b-btn>
        <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3 mr-2" @click="createTransaction(paymentMethods.card)">
          <font-awesome-icon :icon="['fas', 'credit-card']" size="2x" />
          <div>{{ $t('checkout.card') }}</div>
        </b-btn>
        <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3" @click="createTransaction(paymentMethods.cash)">
          <!-- <font-awesome-icon :icon="['fas', 'money-bill']" size="2x" /> -->
          <font-awesome-icon :icon="['fas', 'coins']" size="2x" />
          <div>{{ $t('checkout.cash') }}</div>
        </b-btn>
      </b-overlay>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import CheckoutTotal from '@/components/checkout/_CheckoutTotal'
import SplitCheckoutItem from '@/components/checkout/_SplitCheckoutItem'
import config from '@/config/config'
export default {
  model: {
    prop: 'cartItems',
    event: 'processedItems',
  },

  props: {
    cartItems: {
      type: Array,
      required: true,
    },
  },

  components: {
    CheckoutTotal,
    SplitCheckoutItem,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.localCartItems = [...this.cartItems]
        this.splitCartItems = []
      }
    },
  },

  data() {
    return {
      showModal: false,
      localCartItems: this.cartItems,
      splitCartItems: [],
      saving: false,
    }
  },

  computed: {
    ...mapGetters(['gym', 'totalForCartItems']),

    paymentMethods() {
      return config.transaction.paymentMethods
    },
  },

  methods: {
    moveAllRight() {
      this.splitCartItems = [...this.splitCartItems, ...this.localCartItems]
      this.localCartItems = []
    },

    moveAllLeft() {
      this.localCartItems = [...this.localCartItems, ...this.splitCartItems]
      this.splitCartItems = []
    },

    async createTransaction(cartItems, paymentMethod) {
      this.saving = true
      let transaction = await this.$store.dispatch('createTransactionFromCartItems', { cartItems: this.cartItems, paymentMethod: paymentMethod })
      this.$emit('processed', transaction)
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
