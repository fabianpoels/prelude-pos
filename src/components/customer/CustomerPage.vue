<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4" style="height: 100%;">
      <b-col cols="12" lg="8">
        <default-card :title="$t('topbar.customers')" class="my-3">
          <template slot="header-actions">
            <b-form-input v-model="searchFilter" :placeholder="$t('form.search')" type="search" />
          </template>
          <template slot="actions">
            <div class="d-flex">
              <b-btn variant="primary" v-b-modal.addCustomerModal>
                <font-awesome-icon :icon="['fas', 'plus']" />
                {{ $t('customer.add_customer') }}
              </b-btn>
            </div>
          </template>
          <b-table :fields="fields" :items="tableCustomers" class="my-2" v-if="customers.length > 0" @row-clicked="rowClicked" hover tbody-tr-class="clickableTableRow">
            <template v-slot:cell(customer)="data">
              <customer-dropdown :customer="data.item.customer" />
            </template>
          </b-table>
        </default-card>
      </b-col>
    </b-row>
    <add-customer />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import AddCustomer from '@/components/customer/AddCustomer'
import BaseLayout from '@/components/shared/BaseLayout'
import CustomerDropdown from '@/components/customer/_CustomerDropdown'
import DefaultCard from '@/components/shared/DefaultCard'
export default {
  components: {
    AddCustomer,
    BaseLayout,
    CustomerDropdown,
    DefaultCard,
  },

  computed: {
    ...mapGetters(['customers']),

    fields() {
      return [
        { key: 'name', label: this.$i18n.t('customer.name'), sortable: true },
        { key: 'email', label: this.$i18n.t('customer.email'), sortable: true },
        { key: 'town', label: this.$i18n.t('customer.town'), sortable: true },
        { key: 'dateOfBirth', label: this.$i18n.t('customer.date_of_birth') },
        { key: 'customer', label: '' },
      ]
    },

    filteredCustomers() {
      return this.customers.filter(customer => `${customer.firstname} ${customer.lastname}`.toLowerCase().includes(this.searchFilter.toLowerCase()))
    },

    tableCustomers() {
      return this.filteredCustomers.map(customer => {
        return {
          name: `${customer.firstname} ${customer.lastname}`,
          email: customer.email,
          town: `${customer.address.town} (${customer.address.zipCode})`,
          dateOfBirth: customer.dateOfBirth,
          customer: customer,
        }
      })
    },
  },

  data() {
    return {
      searchFilter: '',
    }
  },

  methods: {
    rowClicked({ customer }) {
      this.$bvModal.show(`viewCustomer-${customer._id}-`)
    },
  },
}
</script>
<style>
.clickableTableRow {
  cursor: pointer;
}
</style>
