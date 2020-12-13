<template>
  <b-modal v-model="showModal" id="addToCustomerAccount" :title="$t('checkout.add_to_customer')" scrollable size="lg">
    <b-form-group id="customer" :label="$t('customer.customer')" label-for="customer-input">
      <el-select id="customer-input" v-model="selectedCustomer" :placeholder="$t('customer.customer')" class="w-100" filterable>
        <el-option v-for="customer in customers" :key="customer.id" :label="`${customer.firstname} ${customer.lastname} (${customer.address.town})`" :value="customer.id">
          {{ `${customer.firstname} ${customer.lastname} (${customer.address.town})` }}
        </el-option>
      </el-select>
    </b-form-group>
    <template #modal-footer>
      <save-button variant="primary" class="mr-2 px-5" :disabled="!customerSelected" :saving="saving" @click="addToCustomerAccount()">
        <font-awesome-icon :icon="['fas', 'address-book']" size="2x" />
      </save-button>
    </template>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  computed: {
    ...mapGetters(['customers']),

    customerSelected() {
      return this.selectedCustomer && this.selectedCustomer !== null
    },
  },

  data() {
    return {
      saving: false,
      selectedCustomer: null,
      showModal: false,
    }
  },

  methods: {
    async addToCustomerAccount() {
      this.saving = true
      await this.$store.dispatch('AddCartToCustomerAccount', { customer: this.selectedCustomer })
      this.saving = false
      this.showModal = false
    },
  },

  watch: {
    showModal() {
      this.selectedCustomer = null
    },
  },
}
</script>
