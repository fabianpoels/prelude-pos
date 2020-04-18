import Vue from 'vue'
const SplitCheckoutStore = {
  state: {
    leftCartItems: [],
    rightCartItems: [],
  },

  mutations: {
    setLeftCartItems(state, cartItems) {
      state.leftCartItems = cartItems
    },

    setRightCartItems(state, cartItems) {
      state.rightCartItems = cartItems
    },

    addLeftCartItem(state, cartItem) {
      let index = state.leftCartItems.findIndex(i => i.priceId === cartItem.priceId)
      if (index === -1) {
        state.leftCartItems.push(cartItem)
      } else if (index > -1) {
        cartItem.amount += state.leftCartItems[index].amount
        Vue.set(state.leftCartItems, index, cartItem)
      } else {
        console.error('invalid split checkout add operation')
      }
    },

    addRightCartItem(state, cartItem) {
      let index = state.rightCartItems.findIndex(i => i.priceId === cartItem.priceId)
      if (index === -1) {
        state.rightCartItems.push(cartItem)
      } else if (index > -1) {
        cartItem.amount += state.rightCartItems[index].amount
        Vue.set(state.rightCartItems, index, cartItem)
      } else {
        console.error('invalid split checkout add operation')
      }
    },
  },

  actions: {
    initializeSplitCheckout({ commit }, cartItems) {
      commit('setLeftCartItems', cartItems)
      commit('setRightCartItems', [])
    },

    moveAllLeft({ commit, getters }) {
      let rightCartItems = [...getters.rightCartItems]
      commit('setRightCartItems', [])
      rightCartItems.forEach(cartItem => {
        commit('addLeftCartItem', cartItem)
      })
    },

    moveAllRight({ commit, getters }) {
      let leftCartItems = [...getters.leftCartItems]
      commit('setLeftCartItems', [])
      leftCartItems.forEach(cartItem => {
        commit('addRightCartItem', cartItem)
      })
    },

    moveFullItemLeft({ commit, getters }, cartItem) {
      let rightCartItems = [...getters.rightCartItems]
      let index = rightCartItems.findIndex(i => i.priceId === cartItem.priceId)
      if (index > -1) {
        let item = rightCartItems.splice(index, 1)[0]
        commit('setRightCartItems', rightCartItems)
        commit('addLeftCartItem', item)
      } else {
        console.error('invalid split checkout move all left operation')
      }
    },

    moveFullItemRight({ commit, getters }, cartItem) {
      let leftCartItems = [...getters.leftCartItems]
      let index = leftCartItems.findIndex(i => i.priceId === cartItem.priceId)
      if (index > -1) {
        let item = leftCartItems.splice(index, 1)[0]
        commit('setLeftCartItems', leftCartItems)
        commit('addRightCartItem', item)
      } else {
        console.error('invalid split checkout move all right operation')
      }
    },

    moveOneLeft({ commit, getters, dispatch }, cartItem) {
      if (cartItem.amount === 1) {
        dispatch('moveAllLeft', cartItem)
      } else if (cartItem.amount > 1) {
        let rightCartItems = [...getters.rightCartItems]
        let index = rightCartItems.findIndex(i => i.priceId === cartItem.priceId)
        if (index > -1) {
          rightCartItems[index] = { amount: cartItem.amount - 1, priceId: cartItem.priceId }
          commit('setRightCartItems', rightCartItems)
          commit('addLeftCartItem', { amount: 1, priceId: cartItem.priceId })
        } else {
          console.error('invalid split checkout move one left operation')
        }
      }
    },

    moveOneRight({ commit, getters, dispatch }, cartItem) {
      if (cartItem.amount === 1) {
        dispatch('moveAllRight', cartItem)
      } else if (cartItem.amount > 1) {
        let leftCartItems = [...getters.leftCartItems]
        let index = leftCartItems.findIndex(i => i.priceId === cartItem.priceId)
        if (index > -1) {
          leftCartItems[index] = { amount: cartItem.amount - 1, priceId: cartItem.priceId }
          commit('setLeftCartItems', leftCartItems)
          commit('addRightCartItem', { amount: 1, priceId: cartItem.priceId })
        } else {
          console.error('invalid split checkout move one right operation')
        }
      }
    },
  },

  getters: {
    leftCartItems: state => state.leftCartItems,
    rightCartItems: state => state.rightCartItems,
  },
}

export default SplitCheckoutStore
