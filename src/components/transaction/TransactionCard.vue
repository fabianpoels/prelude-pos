<template>
  <b-card class="mb-2">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-between align-items-center cardTitle pb-4" @click="expanded = !expanded">
        <div class="h4 text-info">#{{ transaction.number }}</div>
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
        <div style="width: 28px;" class="text-muted">
          <font-awesome-icon :icon="[paymentIcon.style, paymentIcon.icon]" size="2x" />
        </div>
        <div style="width: 150px; text-align: right;">{{ $helpers.formatPrice(gym.settings, transaction.totalAmount) }}</div>
        <div>
          <font-awesome-icon :icon="['fas', collapseIcon]" size="2x" />
        </div>
      </div>
      <b-collapse v-model="expanded" :accordion="accordion">
        <b-row>
          <b-col cols="3">
            <div>
              <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
              {{ user.firstname }} {{ user.lastname }}
            </div>
            <div>
              <font-awesome-icon :icon="['fas', 'cash-register']" class="mr-2" />
              {{ pos.name }}
            </div>
          </b-col>
          <b-col cols="9">
            <b-table :fields="fields" :items="tableItems"> </b-table>
          </b-col>
        </b-row>
      </b-collapse>
    </div>
  </b-card>
</template>
<script>
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
export default {
  props: {
    transaction: {
      type: Object,
      required: true,
    },
    accordion: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      expanded: false,
    }
  },

  computed: {
    ...mapGetters(['gym', 'userById', 'posById', 'priceById', 'categoryById', 'itemById']),

    collapseIcon() {
      return this.expanded ? 'chevron-up' : 'chevron-down'
    },

    paymentIcon() {
      switch (this.transaction.paymentMethod) {
        case 'cash':
          return { style: 'fas', icon: 'coins' }
        case 'card':
          return { style: 'fas', icon: 'credit-card' }
        case 'creditCard':
          return { style: 'fab', icon: 'cc-visa' }
        default:
          return { style: 'fas', icon: 'coins' }
      }
    },

    formattedDate() {
      return this.$helpers.formatDate(this.gym.settings, DateTime.fromJSDate(this.transaction.createdAt))
    },

    formattedTime() {
      return this.$helpers.formatTime(this.gym.settings, DateTime.fromJSDate(this.transaction.createdAt))
    },

    user() {
      return this.userById(this.transaction.user)
    },

    pos() {
      return this.posById(this.transaction.pos)
    },

    fields() {
      return [
        { key: 'item', label: this.$i18n.t('datastructure.item') },
        { key: 'category', label: this.$i18n.t('datastructure.category') },
        { key: 'price', label: this.$i18n.t('datastructure.price') },
        { key: 'amount', label: this.$i18n.t('transaction.amount') },
        { key: 'total', label: this.$i18n.t('transaction.total') },
      ]
    },

    tableItems() {
      let items = []
      let prices = [...this.transaction.prices]
      let priceIds = [...new Set(prices.map(p => p._id))]
      priceIds.forEach(priceId => {
        let price = prices.find(p => p._id === priceId)
        let item = this.itemById(price.item)
        let amount = prices.filter(p => p._id === priceId).length
        items.push({
          item: price.name && price.name.length > 0 ? `${item.name}: ${price.name}` : item.name,
          category: this.categoryById(item.category).name,
          price: this.$helpers.formatPrice(this.gym.settings, price.salesPrice),
          amount: amount,
          total: this.$helpers.formatPrice(this.gym.settings, price.salesPrice * amount),
        })
      })
      return items
    },
  },
}
</script>
<style scoped>
.cardTitle {
  cursor: pointer;
}
</style>
