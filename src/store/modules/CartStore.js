import Vue from 'vue'
const CartStore = {
  state: {
    cartItems: [],
    cartBackup: [],
  },

  mutations: {
    setCart(state, cartItems) {
      state.cartItems = cartItems
    },

    addToCart(state, priceId) {
      let index = state.cartItems.findIndex(c => c.priceId === priceId)
      if (index === -1) {
        state.cartItems.push({
          amount: 1,
          priceId: priceId,
        })
      } else {
        let cartItem = { ...state.cartItems[index] }
        cartItem.amount++
        Vue.set(state.cartItems, index, cartItem)
      }
    },

    removeOneFromCart(state, priceId) {
      let index = state.cartItems.findIndex(c => c.priceId === priceId)
      if (index > -1) {
        let cartItem = { ...state.cartItems[index] }
        if (cartItem.amount > 1) {
          cartItem.amount--
          Vue.set(state.cartItems, index, cartItem)
        } else {
          state.cartItems.splice(index, 1)
        }
      }
    },

    removeFromCart(state, priceId) {
      let index = state.cartItems.findIndex(c => c.priceId === priceId)
      if (index > -1) {
        state.cartItems.splice(index, 1)
      }
    },

    clearCart(state) {
      state.cartBackup = state.cartItems
      state.cartItems = []
    },

    restoreCartBackup(state) {
      state.cartItems = state.cartBackup
      state.cartBackup = []
    },

    clearCartStore(state) {
      state.cartItems = []
      state.cartBackup = []
    },
  },

  actions: {
    async addCartToCustomerAccount({ commit, getters, dispatch }, customer) {
      await dispatch('addCartItemsToCustomerAccount', { customer: customer, cartItems: getters.cartItems })
      commit('clearCartStore')
    },
  },

  getters: {
    cartItems: state => state.cartItems,
    cartBackup: state => state.cartBackup,
    cartHasItems: (state, getters) => getters.cartItems.length > 0,
    cartHasBackup: (state, getters) => getters.cartBackup.length > 0,
    cartItemsCount: (state, getters) => getters.cartItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
    cartTotal: (state, getters, rootState, rootGetters) => getters.cartItems.reduce((sum, cartItem) => sum + rootGetters.priceById(cartItem.priceId).salesPrice * cartItem.amount, 0),
    totalForCartItems: (state, getters, rootState, rootGetters) => cartItems => cartItems.reduce((sum, cartItem) => sum + rootGetters.priceById(cartItem.priceId).salesPrice * cartItem.amount, 0),
  },
}

export default CartStore
