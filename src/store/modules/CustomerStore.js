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
        state.customers.findIndex(c => c.id === customer.id),
        customer
      )
    },
  },

  actions: {
    async createCustomer({ commit }, data) {
      let newCustomer = new Customer(data)
      await newCustomer.save()
      commit('addCustomer', newCustomer.toObject({ virtuals: true }))
    },

    async loadCustomers({ commit }) {
      let customers = await Customer.find().lean({ virtuals: true })
      commit('setCustomers', customers)
    },

    async updateCustomer({ commit }, customer) {
      let dbcustomer = await Customer.findByIdAndUpdate(customer._id, customer, { new: true })
      commit('updateCustomer', dbcustomer.toObject({ virtuals: true }))
    },

    async deleteCustomer({ commit }, customer) {
      customer.archived = true
      let dbcustomer = await Customer.findByIdAndUpdate(customer._id, customer, { new: true })
      commit('updateCustomer', dbcustomer.toObject({ virtuals: true }))
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
      commit('updateCustomer', dbCustomer.toObject({ virtuals: true }))
    },

    async deleteEntryTokenItemFromCustomer({ commit }, { customer, token }) {
      let dbCustomer = await Customer.findById(customer._id)
      dbCustomer.entryTokens = dbCustomer.entryTokens.filter(et => et._id.toString() !== token._id.toString())
      await dbCustomer.save()
      commit('updateCustomer', dbCustomer.toObject({ virtuals: true }))
    },

    async registerEntry({ commit, dispatch, getters }, { customer, token, date }) {
      let dbCustomer = await Customer.findById(customer._id)
      let customerToken = dbCustomer.entryTokens.find(t => t._id.toString() === token._id.toString())
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
        commit('updateCustomer', dbCustomer.toObject({ virtuals: true }))
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
      commit('updateCustomer', dbCustomer.toObject({ virtuals: true }))
    },

    async addCommentToCustomer({ commit }, { customer, comment, user, datetime }) {
      let dbCustomer = await Customer.findById(customer._id)
      dbCustomer.comments.push({
        comment: comment,
        user: user._id,
        datetime: datetime,
      })
      await dbCustomer.save()
      commit('updateCustomer', dbCustomer.toObject({ virtuals: true }))
    },
  },

  getters: {
    customers: state => [...state.customers].filter(c => c.archived === false).sort((a, b) => a.firstname.localeCompare(b.firstname)),
    customerById: (state, getters) => id => getters.customers.find(c => c.id === id),
    customerByNationalNumber: (state, getters) => nationalNumber => getters.customers.find(c => c.nationalNumber === nationalNumber),
    customerExistsById: (state, getters) => id => getters.customers.some(c => c.id === id),
  },
}

export default CustomerStore
