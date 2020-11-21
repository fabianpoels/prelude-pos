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
        entrances: [],
      }
      if (item.subscriptionDuration && item.subscriptionDuration > 0) {
        customerEntryToken.validUntil = DateTime.local()
          .plus({ months: item.subscriptionDuration })
          .toJSDate()
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

    async registerEntry({ commit, dispatch, getters }, { customer, token, date }) {
      let dbCustomer = await Customer.findById(customer._id)
      let customerToken = await dbCustomer.entryTokens.find(t => t._id.toString() === token._id.toString())
      let luxonDate = DateTime.fromJSDate(date)
      let purchasedAt = DateTime.fromJSDate(customerToken.purchasedAt)
      let validUntil = DateTime.fromJSDate(customerToken.validUntil)
      let entriesLeft = true
      if (customerToken.item.tokenType === 'punchcard' && customerToken.entrances.length >= customerToken.item.punchcardEntries) entriesLeft = false
      if (purchasedAt.startOf('day') <= luxonDate && validUntil.endOf('day') >= luxonDate && entriesLeft) {
        customerToken.entrances.push(date)
        let sortedEntrances = customerToken.entrances.map(e => DateTime.fromJSDate(e))
        sortedEntrances.sort((a, b) => b - a)
        customerToken.entrances = sortedEntrances.map(e => e.toJSDate())
        await dbCustomer.save()

        await dispatch('logEntry', {
          user: getters.currentUser,
          customer: customer,
          item: token.item,
          price: token.price,
          datetime: date,
        })
        commit('updateCustomer', dbCustomer.toObject({ getters: true }))
      }
    },

    async deleteEntry({ commit, dispatch, getters }, { customer, token, index }) {
      let dbCustomer = await Customer.findById(customer._id)
      let customerToken = dbCustomer.entryTokens.find(t => t._id.toString() === token._id.toString())
      let datetime = customerToken.entrances[index]
      customerToken.entrances.splice(index, 1)
      // ADD VALIDATION
      await dbCustomer.save()
      await dispatch('logEntry', {
        user: getters.currentUser,
        customer: customer,
        item: token.item,
        price: token.price,
        datetime: datetime,
        isCorrection: true,
      })
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
