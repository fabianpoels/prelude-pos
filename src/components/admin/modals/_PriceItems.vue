<template>
  <div>
    <h6>{{ $t('datastructure.prices') }}</h6>
    <b-input-group v-for="(price, index) in localPrices" :key="index" class="mb-2">
      <b-form-input type="text" :value="price.name" disabled readonly />
      <b-form-input type="text" :value="$helpers.formatPrice(gym.settings, price.salesPrice)" disabled readonly />
      <b-form-select v-model="price.vatRegime" :options="vatFormOptions" disabled></b-form-select>
      <b-input-group-append>
        <b-btn variant="danger" @click="removePrice(index)">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-btn>
      </b-input-group-append>
    </b-input-group>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  model: {
    prop: 'prices',
    event: 'input',
  },

  props: {
    prices: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      localPrices: [...this.prices],
      newPrice: this.blankPrice(),
    }
  },

  watch: {
    'item.category'(categoryId) {
      if (categoryId) {
        this.newPrice.vatRegime = this.categoryById(categoryId.toString()).vatRegime
      }
    },

    prices() {
      this.localPrices = [...this.prices]
    },
  },

  computed: {
    ...mapGetters(['gym', 'vatFormOptions', 'categoryById']),
  },

  methods: {
    addPrice() {
      this.localPrices.push(this.newPrice)
      this.newPrice = this.blankPrice()
      this.$emit('input', this.localPrices)
    },

    removePrice(index) {
      this.localPrices.splice(index, 1)
      this.$emit('input', this.localPrices)
    },

    blankPrice() {
      return {
        name: null,
        salesPrice: 0,
        vatRegime: this.item.vatRegime,
        item: this.item.id,
      }
    },
  },
}
</script>
