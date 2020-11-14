<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="12" lg="8">
        <default-card :title="$t('datastructure.items')" class="my-3">
          <template slot="header-actions">
            <b-form-input v-model="searchFilter" :placeholder="$t('form.search')" type="search" />
          </template>
          <template slot="actions">
            <div class="d-flex">
              <b-btn variant="primary" v-b-modal.addItemModal>
                <font-awesome-icon :icon="['fas', 'plus']" />
                {{ $t('datastructure.add_item') }}
              </b-btn>
            </div>
          </template>
          <b-table :fields="fields" :items="tableItems" class="my-2" v-if="items.length > 0">
            <template v-slot:cell(prices)="data">
              <b-badge :id="`item-prices-badge-${data.item.item._id}`">{{ data.item.prices.length }}</b-badge>
              <b-tooltip :target="`item-prices-badge-${data.item.item._id}`" triggers="hover">
                <template v-for="(price, index) in data.item.prices">
                  <span :key="`span-${index}`">{{ price.name }}: {{ $helpers.formatPrice(gym.settings, price.salesPrice) }}</span>
                  <br :key="`br-${index}`" />
                </template>
              </b-tooltip>
            </template>
            <template v-slot:cell(button)="data">
              <b-badge variant="success" v-if="data.item.button">{{ $t('form.yes') }}</b-badge>
              <b-badge variant="danger" v-else>{{ $t('form.no') }}</b-badge>
            </template>
            <template v-slot:cell(item)="data">
              <item-dropdown :item="data.value" />
            </template>
          </b-table>
        </default-card>
      </b-col>
    </b-row>
    <add-item />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import AddItem from '@/components/admin/modals/AddItem'
import BaseLayout from '@/components/shared/BaseLayout'
import DefaultCard from '@/components/shared/DefaultCard'
import ItemDropdown from '@/components/admin/_ItemDropdown'
export default {
  components: {
    AddItem,
    BaseLayout,
    DefaultCard,
    ItemDropdown,
  },

  computed: {
    ...mapGetters(['businessUnits', 'categories', 'gym', 'items', 'pricesForItem', 'itemHasButton']),

    fields() {
      return [
        { key: 'name', label: this.$i18n.t('datastructure.name'), sortable: true },
        { key: 'prices', label: this.$i18n.t('datastructure.prices') },
        { key: 'button', label: this.$i18n.t('layout.button') },
        { key: 'identifier', label: this.$i18n.t('datastructure.identifier') },
        { key: 'category', label: this.$i18n.t('datastructure.category'), sortable: true },
        { key: 'businessUnit', label: this.$i18n.t('datastructure.business_unit'), sortable: true },
        { key: 'item', label: '' },
      ]
    },

    filteredItems() {
      return this.items.filter(item => item.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
    },

    tableItems() {
      return this.filteredItems.map(item => {
        let category = this.categories.find(c => c._id === item.category)
        let businessUnit = this.businessUnits.find(bu => bu._id === category.businessUnit)
        return {
          name: item.name,
          prices: this.pricesForItem(item),
          button: this.itemHasButton(item),
          identifier: item.identifier,
          category: category.name,
          businessUnit: businessUnit.name,
          item: item,
        }
      })
    },
  },

  data() {
    return {
      searchFilter: '',
    }
  },
}
</script>
