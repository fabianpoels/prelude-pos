import Vue from 'vue'
import Customer from '@/models/customer'

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
      console.log(data)
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
  },

  getters: {
    customers: state => [...state.customers].filter(c => c.archived === false).sort((a, b) => a.firstname.localeCompare(b.firstname)),
    customerById: getters => id => getters.customers.find(c => c._id === id),
    customerExistsById: getters => id => getters.customers.some(c => c._id === id),
  },
}

export default CustomerStore
