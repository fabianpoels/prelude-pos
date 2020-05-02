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
  },

  getters: {
    customers: state => [...state.customers].sort((a, b) => a.firstname.localeCompare(b.firstname)),
  },
}

export default CustomerStore
