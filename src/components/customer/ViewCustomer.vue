<template>
  <b-modal size="lg" :id="`viewCustomer-${customer._id}-${modalIdSuffix}`" :title="`${customer.firstname} ${customer.lastname}`" body-bg-variant="100" no-close-on-backdrop>
    <div slot="modal-footer">
      <!-- <save-button :disabled="!validInput" :saving="saving" @click="updateCustomer()">{{ $t('form.save') }}</save-button> -->
    </div>
  </b-modal>
</template>
<script>
export default {
  props: {
    customer: {
      type: Object,
      required: true,
    },
    modalIdSuffix: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped></style>
