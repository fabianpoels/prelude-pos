<template>
  <b-modal v-model="showModal" :id="`deleteCustomer-${customer._id}`" :title="`${$t('customer.delete_customer')} ?`" body-bg-variant="100" no-close-on-backdrop>
    <div>{{ customer.firstname }} {{ customer.lastname }}</div>
    <div slot="modal-footer">
      <save-button variant="danger" :saving="deleting" :savingText="$t('form.deleting')" @click="deleteCustomer()">{{ $t('form.delete') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    customer: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      deleting: false,
    }
  },

  components: {
    SaveButton,
  },

  methods: {
    async deleteCustomer() {
      this.deleting = true
      this.$emit('delete')
      await this.$store.dispatch('deleteCustomer', { ...this.customer })
      this.deleting = false
      this.showModal = false
    },
  },
}
</script>
