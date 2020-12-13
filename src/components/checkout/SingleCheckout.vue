<template>
  <b-modal v-model="showModal" id="singleCheckout" :title="$t('checkout.checkout')" scrollable size="lg">
    <div class="d-flex flex-column">
      <div class="shadow-sm rounded p-3 border mb-2">
        <checkout-item v-for="(cartItem, index) in localCartItems" :cartItem="cartItem" :key="index" />
      </div>
      <checkout-total :totalAmount="totalForCartItems(localCartItems)" />
    </div>
    <div slot="modal-footer" class="w-100">
      <b-overlay :show="saving" rounded="sm" class="w-100 d-flex flex-column">
        <div class="w-100 d-flex flex-row">
          <el-select id="customer-input" v-model="selectedCustomer" :placeholder="$t('customer.customer')" class="mr-2" filterable>
            <el-option v-for="customer in customers" :key="customer.id" :label="`${customer.firstname} ${customer.lastname} (${customer.address.town})`" :value="customer.id">
              {{ `${customer.firstname} ${customer.lastname} (${customer.address.town})` }}
            </el-option>
          </el-select>
          <b-btn size="sm" variant="outline-secondary" @click="selectedCustomer = null" :disabled="!selectedCustomer">{{ $t('form.clear') }}</b-btn>
        </div>
        <div class="w-100 d-flex flex-row mt-3">
          <b-btn variant="primary" :disabled="!customerSelected" class="w-100 d-flex flex-column align-items-center py-3 mr-2" @click="addToCustomerAccount()">
            <font-awesome-icon :icon="['fas', 'address-book']" size="2x" />
            <div>{{ $t('checkout.customer_account') }}</div>
          </b-btn>
          <b-btn variant="success" class="w-100 d-flex flex-column align-items-center py-3 mr-2" @click="createTransaction(paymentMethods.creditCard)">
            <font-awesome-icon :icon="['fas', 'credit-card']" size="2x" />
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
        </div>
      </b-overlay>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import config from '@/config/config'
import CheckoutItem from '@/components/checkout/_CheckoutItem'
import CheckoutTotal from '@/components/checkout/_CheckoutTotal'
export default {
  components: {
    CheckoutItem,
    CheckoutTotal,
  },

  computed: {
    ...mapGetters(['customers', 'gym', 'totalForCartItems']),

    customerSelected() {
      return this.selectedCustomer && this.selectedCustomer !== null
    },

    paymentMethods() {
      return config.transaction.paymentMethods
    },
  },

  data() {
    return {
      selectedCustomer: null,
      showModal: false,
      localCartItems: this.cartItems,
      saving: false,
    }
  },

  methods: {
    async addToCustomerAccount() {
      this.saving = true
      this.saving = false
      this.showModal = false
    },

    async createTransaction(paymentMethod) {
      this.saving = true
      let transaction = await this.$store.dispatch('createTransactionFromCartItems', { cartItems: this.localCartItems, paymentMethod: paymentMethod })
      this.$emit('processed', transaction)
      this.saving = false
      this.showModal = false
    },
  },

  props: {
    cartItems: {
      type: Array,
      required: true,
    },
  },

  watch: {
    showModal(value) {
      if (value) {
        this.localCartItems = [...this.cartItems]
        this.selectedCustomer = null
      }
    },
  },
}
</script>
