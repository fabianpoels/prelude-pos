import Vue from 'vue'
const CheckoutStore = {
  state: {
    cartItems: [],
  },

  mutations: {
    setCheckoutCartItems(state, cartItems) {
      state.cartItems = cartItems
    },
  },

  actions: {},

  getters: {},
}

export default CheckoutStore
