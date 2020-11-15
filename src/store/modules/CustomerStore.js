import Vue from 'vue'
import Customer from '@/models/customer'
import { DateTime } from 'luxon'

let CustomerStore = {
  state: {
    customers: [],
  },

  mutations: {
    setCustomers(state, customers) {
      state.customers = customers
    },

    addCustomer(state, customer) {
      state.customers.push(customer)
    },

    updateCustomer(state, customer) {
      Vue.set(
        state.customers,
        state.customers.findIndex(c => c._id === customer._id),
        customer
      )
    },
  },

  actions: {
    async createCustomer({ commit }, data) {
      let newCustomer = new Customer(data)
      await newCustomer.save()
      commit('addCustomer', newCustomer.toObject({ getters: true }))
    },

    async loadCustomers({ commit }) {
      let customers = await Customer.find().lean()
      commit('setCustomers', customers)
    },

    async updateCustomer({ commit }, customer) {
      let dbcustomer = await Customer.findByIdAndUpdate(customer._id, customer, { new: true })
      commit('updateCustomer', dbcustomer.toObject({ getters: true }))
    },

    async deleteCustomer({ commit }, customer) {
      customer.archived = true
      let dbcustomer = await Customer.findByIdAndUpdate(customer._id, customer, { new: true })
      commit('updateCustomer', dbcustomer.toObject({ getters: true }))
    },

    async addEntryTokenItemToCustomer({ commit }, { customer, price, item }) {
      let dbCustomer = await Customer.findById(customer._id)
      let customerEntryToken = {
        item: item,
        price: price,
        purchasedAt: DateTime.local().toJSDate(),
        validUntil: DateTime.local()
          .plus({ months: item.subscriptionDuration })
          .toJSDate(),
        entrances: [],
      }
      dbCustomer.entryTokens.unshift(customerEntryToken)
      await dbCustomer.save()
      commit('updateCustomer', dbCustomer.toObject({ getters: true }))
    },

    async deleteEntryTokenItemFromCustomer({ commit }, { customer, token }) {
      let dbCustomer = await Customer.findById(customer._id)
      dbCustomer.entryTokens = dbCustomer.entryTokens.filter(et => et._id.toString() !== token._id.toString())
      await dbCustomer.save()
      commit('updateCustomer', dbCustomer.toObject({ getters: true }))
    },

    async registerEntry({ commit }, { customer, token, date }) {
      let dbCustomer = await Customer.findById(customer._id)
      let customerToken = dbCustomer.entryTokens.find(t => t._id.toString() === token._id.toString())
      customerToken.entrances.push(date)
      // ADD VALIDATION
      await dbCustomer.save()
      commit('updateCustomer', dbCustomer.toObject({ getters: true }))
    },
  },

  getters: {
    customers: state => [...state.customers].filter(c => c.archived === false).sort((a, b) => a.firstname.localeCompare(b.firstname)),
    customerById: (state, getters) => id => getters.customers.find(c => c._id === id),
    customerByNationalNumber: (state, getters) => nationalNumber => getters.customers.find(c => c.nationalNumber === nationalNumber),
    customerExistsById: (state, getters) => id => getters.customers.some(c => c._id === id),
  },
}

export default CustomerStore
