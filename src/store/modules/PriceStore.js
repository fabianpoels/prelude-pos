import Vue from 'vue'
import Price from '@/models/price'
import Transaction from '@/models/transaction'

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
        state.prices.findIndex(p => p._id === price._id),
        price
      )
    },

    deletePrice(state, price) {
      state.prices.splice(
        state.prices.findIndex(p => p._id === price._id),
        1
      )
    },
  },

  actions: {
    async loadPrices({ commit }, items) {
      let prices = await Price.find({ item: { $in: items.map(i => i._id) } }).lean()
      commit('setPrices', prices)
    },

    async createPrice({ commit }, price) {
      let dbPrice = new Price(price)
      await dbPrice.save()
      price = dbPrice.toObject({ getters: true })
      commit('addPrice', price)
    },

    async createPrices({ commit }, prices) {
      let dbPrices = await Price.insertMany(prices)
      prices = dbPrices.map(p => p.toObject({ getters: true }))
      commit('addPrices', prices)
      return prices
    },

    async updatePrice({ commit }, price) {
      let dbPrice = await Price.findByIdAndUpdate(price._id, price, { new: true })
      commit('updatePrice', dbPrice.toObject({ getters: true }))
    },

    async deletePrice({ commit, dispatch }, price) {
      if (await Transaction.exists({ priceIds: price._id })) {
        price.archived = true
        await dispatch('updatePrice', price)
      } else {
        await Price.findByIdAndDelete(price._id)
        commit('deletePrice', price)
      }
    },
  },

  getters: {
    prices: state => state.prices.filter(p => p.archived === false),
    priceById: state => id => state.prices.find(p => p._id === id),
    pricesForItem: getters => item => getters.prices.filter(p => p.item === item._id),
  },
}

export default PriceStore
