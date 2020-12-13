<template>
  <b-modal v-model="showModal" :id="`editItemPrices-${item.id}`" :title="`${$t('datastructure.edit_prices')}: ${item.name}`" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <price-item v-for="price in pricesForItem(item)" :key="price.id" :price="price" class="mb-2" />
      <b-overlay :show="saving" rounded="sm" spinner-small class="mt-2">
        <b-input-group>
          <b-form-input type="text" v-model="newPrice.name" :placeholder="$t('datastructure.name')" />
          <b-form-input type="number" min="0.00" v-model="newPrice.salesPrice" />
          <b-form-select v-model="newPrice.vatRegime" :options="vatFormOptions"></b-form-select>
          <b-input-group-append>
            <b-btn variant="primary" @click="addPrice()">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-overlay>
    </b-form>

    <div slot="modal-footer">
      <b-btn variant="primary" @click="showModal = false">{{ $t('form.ok') }}</b-btn>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import PriceItem from '@/components/admin/modals/_PriceItem'
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    category: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      prices: [],
      newPrice: this.blankPrice(),
    }
  },

  components: {
    PriceItem,
  },

  computed: {
    ...mapGetters(['pricesForItem', 'vatFormOptions']),

    validInput() {
      return true
    },
  },

  methods: {
    async addPrice() {
      this.saving = true
      await this.$store.dispatch('createPrice', this.newPrice)
      this.newPrice = this.blankPrice()
      this.saving = false
    },

    blankPrice() {
      return {
        name: null,
        salesPrice: 0,
        vatRegime: this.category.vatRegime,
        item: this.item.id,
      }
    },
  },
}
</script>
