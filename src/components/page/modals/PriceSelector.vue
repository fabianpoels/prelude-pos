<template>
  <b-modal v-model="showModal" :id="`selectPrice-${position}`" :title="`${$t('page.select_price')}: ${item.name}`" body-bg-variant="100">
    <div class="pricesList">
      <b-btn style="font-size: 120%;" variant="primary" v-for="price in pricesForItem(item)" :key="price.id" @click="selectPrice(price)" class="my-2 py-5"
        >{{ price.name }} ({{ $helpers.formatPrice(gym.settings, price.salesPrice) }})</b-btn
      >
    </div>
    <div slot="modal-footer">
      <b-btn variant="secondary" @click="showModal = false">{{ $t('form.cancel') }}</b-btn>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      showModal: false,
    }
  },

  computed: {
    ...mapGetters(['gym', 'pricesForItem']),
  },

  methods: {
    selectPrice(price) {
      this.$emit('select', price.id)
      this.showModal = false
    },
  },
}
</script>
<style scoped>
.pricesList {
  display: flex;
  flex-direction: column;
}
</style>
