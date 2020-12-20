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

    deleteCustomerAccount(state, customerAccount) {
      state.customerAccounts.splice(
        state.customerAccounts.findIndex(ca => ca.id === customerAccount.id),
        1
      )
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
          let index = customerAccount.accountItems.findIndex(p => p.price.toString() === cartItem.priceId)
          if (index === -1) {
            customerAccount.accountItems.push({
              price: price._id,
              amount: cartItem.amount,
            })
          } else {
            customerAccount.accountItems[index].amount += cartItem.amount
          }
        }
      })
      await customerAccount.save()
      commit('updateCustomerAccount', customerAccount.toObject({ virtuals: true }))
    },

    async addAccountItemsToCustomerAccount({ commit, rootGetters }, { customer, accountItems }) {
      let gym = rootGetters.gym
      let customerAccount = await CustomerAccount.findOneAndUpdate({ customer: customer._id, gym: gym._id }, { customer: customer._id, gym: gym._id }, { new: true, upsert: true })
      accountItems.forEach(accountItem => {
        let price = rootGetters.priceById(accountItem.price.toString())
        if (price && price._id && price._id !== null) {
          let index = customerAccount.accountItems.findIndex(ai => ai.price.toString() === accountItem.price.toString())
          if (index === -1) {
            customerAccount.accountItems.push({
              price: price._id,
              amount: accountItem.amount,
            })
          } else {
            customerAccount.accountItems[index].amount += accountItem.amount
          }
        }
      })
      await customerAccount.save()
      commit('updateCustomerAccount', customerAccount.toObject({ virtuals: true }))
    },

    async deleteCustomerAccount({ commit }, customerAccount) {
      await CustomerAccount.deleteOne({ _id: customerAccount._id })
      commit('deleteCustomerAccount', customerAccount)
    },
  },

  getters: {
    customerAccounts: state => state.customerAccounts,
    totalForCustomerAccount: (state, getters, rootState, rootGetters) => customerAccount =>
      customerAccount.accountItems.reduce((sum, accountItem) => sum + rootGetters.priceById(accountItem.price.toString()).salesPrice * accountItem.amount, 0),
    customerAccountItemsCount: () => customerAccount => customerAccount.accountItems.reduce((sum, accountItem) => sum + accountItem.amount, 0),
  },
}

export default CartStore
