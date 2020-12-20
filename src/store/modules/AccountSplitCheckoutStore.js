import Vue from 'vue'
const AccountSplitCheckoutStore = {
  namespaced: true,

  state: {
    leftAccountItems: [],
    rightAccountItems: [],
  },

  mutations: {
    setLeftAccountItems(state, accountItems) {
      state.leftAccountItems = accountItems
    },

    setRightAccountItems(state, accountItems) {
      state.rightAccountItems = accountItems
    },

    addLeftAccountItem(state, accountItem) {
      let index = state.leftAccountItems.findIndex(i => i.price.toString() === accountItem.price.toString())
      if (index === -1) {
        state.leftAccountItems.push(accountItem)
      } else if (index > -1) {
        accountItem.amount += state.leftAccountItems[index].amount
        Vue.set(state.leftAccountItems, index, accountItem)
      } else {
        console.error('invalid split checkout add operation')
      }
    },

    addRightAccountItem(state, accountItem) {
      let index = state.rightAccountItems.findIndex(i => i.price.toString() === accountItem.price.toString())
      if (index === -1) {
        state.rightAccountItems.push(accountItem)
      } else if (index > -1) {
        accountItem.amount += state.rightAccountItems[index].amount
        Vue.set(state.rightAccountItems, index, accountItem)
      } else {
        console.error('invalid split checkout add operation')
      }
    },

    clearAccountSplitCheckoutStore(state) {
      state.leftAccountItems = []
      state.rightAccountItems = []
    },
  },

  actions: {
    initializeAccountSplitCheckout({ commit }, accountItems) {
      commit('setLeftAccountItems', accountItems)
      commit('setRightAccountItems', [])
    },

    moveAllLeft({ commit, getters }) {
      let rightAccountItems = [...getters.rightAccountItems]
      commit('setRightAccountItems', [])
      rightAccountItems.forEach(accountItem => {
        commit('addLeftAccountItem', accountItem)
      })
    },

    moveAllAccountItemsRight({ commit, getters }) {
      let leftAccountItems = [...getters.leftAccountItems]
      commit('setLeftAccountItems', [])
      leftAccountItems.forEach(accountItem => {
        commit('addRightAccountItem', accountItem)
      })
    },

    moveFullItemLeft({ commit, getters }, accountItem) {
      let rightAccountItems = [...getters.rightAccountItems]
      let index = rightAccountItems.findIndex(i => i.price.toString() === accountItem.price.toString())
      if (index > -1) {
        let item = rightAccountItems.splice(index, 1)[0]
        commit('setRightAccountItems', rightAccountItems)
        commit('addLeftAccountItem', item)
      } else {
        console.error('invalid split checkout move all left operation')
      }
    },

    moveFullItemRight({ commit, getters }, accountItem) {
      let leftAccountItems = [...getters.leftAccountItems]
      let index = leftAccountItems.findIndex(i => i.price.toString() === accountItem.price.toString())
      if (index > -1) {
        let item = leftAccountItems.splice(index, 1)[0]
        commit('setLeftAccountItems', leftAccountItems)
        commit('addRightAccountItem', item)
      } else {
        console.error('invalid split checkout move all right operation')
      }
    },

    moveOneLeft({ commit, getters, dispatch }, accountItem) {
      if (accountItem.amount === 1) {
        dispatch('moveFullItemLeft', accountItem)
      } else if (accountItem.amount > 1) {
        let rightAccountItems = [...getters.rightAccountItems]
        let index = rightAccountItems.findIndex(i => i.price.toString() === accountItem.price.toString())
        if (index > -1) {
          rightAccountItems[index] = { amount: accountItem.amount - 1, price: accountItem.price }
          commit('setRightAccountItems', rightAccountItems)
          commit('addLeftAccountItem', { amount: 1, price: accountItem.price })
        } else {
          console.error('invalid split checkout move one left operation')
        }
      }
    },

    moveOneRight({ commit, getters, dispatch }, accountItem) {
      if (accountItem.amount === 1) {
        dispatch('moveFullItemRight', accountItem)
      } else if (accountItem.amount > 1) {
        let leftAccountItems = [...getters.leftAccountItems]
        let index = leftAccountItems.findIndex(i => i.price.toString() === accountItem.price.toString())
        if (index > -1) {
          leftAccountItems[index] = { amount: accountItem.amount - 1, price: accountItem.price }
          commit('setLeftAccountItems', leftAccountItems)
          commit('addRightAccountItem', { amount: 1, price: accountItem.price })
        } else {
          console.error('invalid split checkout move one right operation')
        }
      }
    },
  },

  getters: {
    leftAccountItems: state => state.leftAccountItems,
    rightAccountItems: state => state.rightAccountItems,
  },
}

export default AccountSplitCheckoutStore
