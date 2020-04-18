<template>
  <b-modal v-model="showModal" id="splitCheckout" :title="$t('checkout.checkout')" size="xl" scrollable>
    <b-row class="h-100">
      <split-checkout-column :cartItems="leftCartItems" direction="right" />
      <b-col cols="2">
        <div class="d-flex flex-column px-4 border-left border-right justify-content-center h-100">
          <b-btn variant="primary" class="mb-3" @click="moveAllRight()" :disabled="leftCartItems.length === 0">
            <font-awesome-icon :icon="['fas', 'angle-double-right']" size="2x" />
          </b-btn>
          <b-btn variant="primary" @click="moveAllLeft()" :disabled="rightCartItems.length === 0">
            <font-awesome-icon :icon="['fas', 'angle-double-left']" size="2x" />
          </b-btn>
        </div>
      </b-col>
      <split-checkout-column :cartItems="rightCartItems" direction="left" />
    </b-row>
    <div slot="modal-footer" class="w-50 pl-5">
      <b-overlay :show="saving" rounded="sm" class="w-100 d-flex flex-row">
        <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3 mr-2" @click="createTransaction(paymentMethods.creditCard)" :disabled="!checkoutPossible">
          <font-awesome-icon :icon="['fab', 'cc-visa']" size="2x" />
          <div>{{ $t('checkout.credit_card') }}</div>
        </b-btn>
        <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3 mr-2" @click="createTransaction(paymentMethods.card)" :disabled="!checkoutPossible">
          <font-awesome-icon :icon="['fas', 'credit-card']" size="2x" />
          <div>{{ $t('checkout.card') }}</div>
        </b-btn>
        <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3" @click="createTransaction(paymentMethods.cash)" :disabled="!checkoutPossible">
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
import SplitCheckoutColumn from '@/components/checkout/_SplitCheckoutColumn'
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
    SplitCheckoutColumn,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.$store.dispatch('initializeSplitCheckout', this.cartItems)
      }
    },
  },

  data() {
    return {
      showModal: false,
      saving: false,
    }
  },

  computed: {
    ...mapGetters(['gym', 'leftCartItems', 'rightCartItems']),

    paymentMethods() {
      return config.transaction.paymentMethods
    },

    checkoutPossible() {
      return this.rightCartItems.length > 0
    },
  },

  methods: {
    moveAllLeft() {
      this.$store.dispatch('moveAllLeft')
    },

    moveAllRight() {
      this.$store.dispatch('moveAllRight')
    },

    async createTransaction(paymentMethod) {
      this.saving = true
      let transaction = await this.$store.dispatch('createTransactionFromCartItems', { cartItems: this.rightCartItems, paymentMethod: paymentMethod })
      this.$bvToast.toast(`#${transaction.number}: ${this.$helpers.formatPrice(this.gym, transaction.totalAmount)}`, {
        title: this.$i18n.t('checkout.processed'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.$store.commit('setRightCartItems', [])
      this.$emit('processedItems', this.leftCartItems)
      this.saving = false
      if (this.leftCartItems.length === 0) {
        this.showModal = false
      }
    },
  },
}
</script>
