import Vue from 'vue'
import Item from '@/models/item'

const ItemStore = {
  state: {
    items: [],
  },

  mutations: {
    setItems(state, items) {
      state.items = items
    },

    addItem(state, item) {
      state.items.push(item)
    },

    updateItem(state, item) {
      Vue.set(
        state.items,
        state.items.findIndex(i => i._id === item._id),
        item
      )
    },

    deleteItem(state, item) {
      state.items.splice(
        state.items.findIndex(i => i._id === item._id),
        1
      )
    },
  },

  actions: {
    async loadItems({ commit }, categories) {
      let items = await Item.find({ category: { $in: categories.map(c => c._id) } }).lean()
      commit('setItems', items)
    },

    async createItem({ commit, dispatch }, { data, prices }) {
      let item = new Item(data)
      await item.save()
      item = item.toObject({ getters: true })
      prices.forEach(p => {
        p.item = item._id
      })
      prices = await dispatch('createPrices', prices)
      item.prices = prices.map(p => p._id)
      let dbItem = await Item.findByIdAndUpdate(item._id, item, { new: true })
      commit('addItem', dbItem.toObject({ getters: true }))
    },

    async updateItem({ commit }, item) {
      let dbItem = await Item.findByIdAndUpdate(item._id, item, { new: true })
      commit('updateItem', dbItem.toObject({ getters: true }))
    },

    async archiveItem({ getters, dispatch }, { ...item }) {
      if (getters.canArchiveItem(item)) {
        item.archived = true
        dispatch('updateItem', item)
      }
    },

    async deleteItem({ commit, getters }, item) {
      if (getters.canDeleteItem(item)) {
        await Item.deleteOne({ _id: item._id })
        commit('deleteItem', item)
      }
    },
  },

  getters: {
    items: state => state.items.filter(i => i.archived === false),
    itemById: state => id => state.items.find(i => i._id === id),
    itemsForCategory: (state, getters) => category => getters.items.filter(i => i.category === category._id),
    entryTokenItems: (state, getters) => getters.items.filter(i => i.isEntryToken === true),
    canArchiveItem: (state, getters) => item => getters.pricesForItem(item).length === 0,
    canDeleteItem: (state, getters, rootState) => item => rootState.PriceStore.prices.filter(p => p.item === item._id).length === 0,
  },
}

export default ItemStore
