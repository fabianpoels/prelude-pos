<template>
  <div>
    <b-dropdown variant="link-secondary" no-caret>
      <template v-slot:button-content>
        <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
      </template>
      <b-dropdown-item v-b-modal="`editCustomer-${customer._id}`">{{ $t('form.edit') }}</b-dropdown-item>
      <b-dropdown-item v-b-modal="`deleteCustomer-${customer._id}`">{{ $t('form.delete') }}</b-dropdown-item>
    </b-dropdown>
    <delete-customer :customer="customer" />
    <edit-customer :customer="customer" />
  </div>
</template>
<script>
import DeleteCustomer from '@/components/customer/DeleteCustomer'
import EditCustomer from '@/components/customer/EditCustomer'
export default {
  components: {
    DeleteCustomer,
    EditCustomer,
  },

  props: {
    customer: {
      type: Object,
      required: true,
    },
  },
}
</script>
