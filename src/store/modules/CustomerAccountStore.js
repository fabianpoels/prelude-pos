import Vue from 'vue'
import CustomerAccount from '@/models/customerAccount'

const CartStore = {
  state: {
    customerAccounts: [],
  },

  mutations: {
    setCustomerAccounts(state, customerAccounts) {
      state.customerAccounts = customerAccounts
    },

    updateCustomerAccount(state, customerAccount) {
      let index = state.customerAccounts.findIndex(ca => ca.customer.toString() === customerAccount.customer.toString())
      if (index === -1) {
        state.customerAccounts.push(customerAccount)
      } else {
        Vue.set(state.customerAccounts, index, customerAccount)
      }
    },

    clearCustomerAccountStore(state) {
      state.customerAccounts = []
    },
  },

  actions: {
    async loadCustomerAccounts({ commit }, gym) {
      let customerAccounts = await CustomerAccount.find({ gym: gym._id }).lean({ virtuals: true })
      commit('setCustomerAccounts', customerAccounts)
    },

    async addCartItemsToCustomerAccount({ commit, rootGetters }, { customer, cartItems }) {
      let gym = rootGetters.gym
      let customerAccount = await CustomerAccount.findOneAndUpdate({ customer: customer._id, gym: gym._id }, { customer: customer._id, gym: gym._id }, { new: true, upsert: true })
      cartItems.forEach(cartItem => {
        let price = rootGetters.priceById(cartItem.priceId)
        if (price && price._id && price._id !== null) {
          let index = customerAccount.prices.findIndex(p => p.price.toString() === cartItem.priceId)
          if (index === -1) {
            customerAccount.prices.push({
              price: price._id,
              amount: cartItem.amount,
            })
          } else {
            customerAccount.prices[index].amount += cartItem.amount
          }
        }
      })
      await customerAccount.save()
      commit('updateCustomerAccount', customerAccount.toObject({ virtuals: true }))
    },
  },

  getters: {
    customerAccounts: state => state.customerAccounts,
  },
}

export default CartStore
