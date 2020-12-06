<template>
  <div class="buttonCell">
    <b-btn v-if="button" variant="secondary" class="button" :class="{ pageButton: customButton }" @click="addToCart()" :style="buttonStyle">{{ item.name }}</b-btn>
    <b-btn variant="outline-secondary" class="button" v-else disabled></b-btn>
    <price-selector :item="item" :position="position" @select="selectPrice" v-if="button" />
  </div>
</template>
<script>
import chroma from 'chroma-js'
import { mapGetters } from 'vuex'
import PriceSelector from '@/components/page/modals/PriceSelector'
export default {
  props: {
    page: {
      type: Object,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },

  components: {
    PriceSelector,
  },

  computed: {
    ...mapGetters(['itemById', 'pricesForItem']),

    button() {
      return this.page.buttons.find(b => b.key === `${this.x}:${this.y}`)
    },

    item() {
      return this.itemById(this.button.item.toString())
    },

    position() {
      return `${this.x}-${this.y}`
    },

    prices() {
      return this.pricesForItem(this.item)
    },

    customButton() {
      return this.button.color && this.button.color !== ''
    },

    buttonStyle() {
      if (this.customButton) {
        let chromaColor = chroma(this.button.color)
        return {
          '--color': this.button.color,
          '--color-hover': chromaColor.darken(0.5),
          '--text-color': chromaColor.luminance() > 0.5 ? '#000' : '#fff',
        }
      } else {
        return {}
      }
    },
  },

  methods: {
    addToCart() {
      if (this.prices.length === 1) {
        this.selectPrice(this.prices[0].id)
      } else {
        this.$bvModal.show(`selectPrice-${this.position}`)
      }
    },

    selectPrice(priceId) {
      this.$store.commit('addToCart', priceId)
    },
  },
}
</script>
<style scoped>
.buttonCell,
.button {
  width: 100%;
  height: 100%;
  min-width: 80px;
  min-height: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pageButton {
  background-color: var(--color);
  border-color: var(--color);
  color: var(--text-color);
}

.pageButton:hover {
  background-color: var(--color-hover);
  border-color: var(--color-hover);
}
</style>
