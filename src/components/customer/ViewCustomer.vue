<template>
  <b-modal v-model="showModal" size="lg" :id="`viewCustomer-${customer._id}`" :title="`${customer.firstname} ${customer.lastname}`" body-bg-variant="100" no-close-on-backdrop>
    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="updateCustomer()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
import countries from '@/config/countries'
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    customer: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      showModal: false,
      saving: false,
      editCustomer: this.customerCopy(),
    }
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.editCustomer = this.customerCopy()
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'gyms']),

    validInput() {
      return true
    },

    countries() {
      return countries
    },
  },

  methods: {
    async updateCustomer() {
      this.saving = true
      await this.$store.dispatch('updateCustomer', { ...this.editCustomer })
      this.$bvToast.toast(`${this.editCustomer.firstname} ${this.editCustomer.lastname}`, {
        title: this.$i18n.t('customer.customer_saved'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
    },

    customerCopy() {
      let addressCopy = { ...this.customer.address }
      let customerCopy = { ...this.customer }
      customerCopy.address = addressCopy
      return customerCopy
    },
  },
}
</script>

<style scoped></style>
