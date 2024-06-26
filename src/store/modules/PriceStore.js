import Vue from 'vue'
import Price from '@/models/price'
import Transaction from '@/models/transaction'
import Customer from '@/models/customer'
import Entry from '@/models/entry'

const PriceStore = {
  state: {
    prices: [],
  },

  mutations: {
    setPrices(state, prices) {
      state.prices = prices
    },

    addPrice(state, price) {
      state.prices.push(price)
    },

    addPrices(state, prices) {
      state.prices = [...state.prices, ...prices]
    },

    updatePrice(state, price) {
      Vue.set(
        state.prices,
        state.prices.findIndex(p => p.id === price.id),
        price
      )
    },

    deletePrice(state, price) {
      state.prices.splice(
        state.prices.findIndex(p => p.id === price.id),
        1
      )
    },
  },

  actions: {
    async loadPrices({ commit }, items) {
      let prices = await Price.find({ item: { $in: items.map(i => i._id) } }).lean({ virtuals: true })
      commit('setPrices', prices)
    },

    async createPrice({ commit }, price) {
      let dbPrice = new Price(price)
      await dbPrice.save()
      price = dbPrice.toObject({ virtuals: true })
      commit('addPrice', price)
    },

    async createPrices({ commit }, prices) {
      let dbPrices = await Price.insertMany(prices)
      prices = dbPrices.map(p => p.toObject({ virtuals: true }))
      commit('addPrices', prices)
      return prices
    },

    async updatePrice({ commit }, price) {
      let dbPrice = await Price.findByIdAndUpdate(price._id, price, { new: true })
      commit('updatePrice', dbPrice.toObject({ virtuals: true }))
    },

    async deletePrice({ commit, dispatch }, price) {
      if ((await Transaction.exists({ priceIds: price._id })) || (await Entry.exists({ 'price._id': price._id })) || (await Customer.exists({ entryTokens: { $elemMatch: { 'price._id': price._id } } }))) {
        price.archived = true
        await dispatch('updatePrice', price)
      } else {
        await Price.findByIdAndDelete(price._id)
        commit('deletePrice', price)
      }
    },
  },

  getters: {
    prices: state => state.prices.filter(price => price.archived === false),
    priceById: state => id => state.prices.find(p => p.id === id),
    pricesForItem: (state, getters) => item => getters.prices.filter(p => p.item.toString() === item.id),
  },
}

export default PriceStore
