<template>
  <b-modal v-model="showModal" id="singleCheckout" :title="$t('checkout.checkout')" body-bg-variant="100" no-close-on-backdrop>
    <b-list-group>
      <checkout-item v-for="(cartItem, index) in localCartItems" :cartItem="cartItem" :key="index" />
    </b-list-group>
    <span>{{ $t('sidebar.total') }}: {{ $helpers.formatPrice(gym.settings, totalForCartItems(localCartItems)) }}</span>
    <div slot="modal-footer" class="w-100">
      <b-overlay :show="saving" rounded="sm" class="w-100 d-flex flex-row">
        <b-btn variant="success" class="w-100 mr-2" @click="createTransaction(paymentMethods.creditCard)">
          <font-awesome-icon :icon="['fab', 'cc-visa']" size="2x" />
        </b-btn>
        <b-btn variant="success" class="w-100 mr-2" @click="createTransaction(paymentMethods.card)">
          <font-awesome-icon :icon="['fas', 'credit-card']" size="2x" />
        </b-btn>
        <b-btn variant="success" class="w-100" @click="createTransaction(paymentMethods.cash)">
          <font-awesome-icon :icon="['fas', 'money-bill']" size="2x" />
          <font-awesome-icon :icon="['fas', 'coins']" size="2x" />
        </b-btn>
      </b-overlay>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import config from '@/config/config'
import CheckoutItem from '@/components/checkout/_CheckoutItem'
export default {
  props: {
    cartItems: {
      type: Array,
      required: true,
    },
  },

  components: {
    CheckoutItem,
  },

  watch: {
    showModal(value) {
      if (value) this.localCartItems = [...this.cartItems]
    },
  },

  data() {
    return {
      showModal: false,
      localCartItems: this.cartItems,
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
    async createTransaction(paymentMethod) {
      this.saving = true
      await this.$store.dispatch('createTransactionFromCartItems', { cartItems: this.localCartItems, paymentMethod: paymentMethod })
      this.$emit('processed')
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
