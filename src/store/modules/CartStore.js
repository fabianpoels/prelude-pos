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

  actions: {},

  getters: {
    cartItems: state => state.cartItems,
    cartBackup: state => state.cartBackup,
    cartHasItems: getters => getters.cartItems.length > 0,
    cartHasBackup: getters => getters.cartBackup.length > 0,
    cartItemsCount: getters => getters.cartItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
    cartTotal: (getters, rootGetters) => getters.cartItems.reduce((sum, cartItem) => sum + rootGetters.priceById(cartItem.priceId).salesPrice * cartItem.amount, 0),
    totalForCartItems: (getters, rootGetters) => cartItems => cartItems.reduce((sum, cartItem) => sum + rootGetters.priceById(cartItem.priceId).salesPrice * cartItem.amount, 0),
  },
}

export default CartStore
