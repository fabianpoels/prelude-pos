import Customer from '@/models/customer'
import Tag from '@/models/tag'

const TagStore = {
  state: {},

  mutations: {},

  actions: {
    // eslint-disable-next-line no-empty-pattern
    async loadTagsForCustomer({}, customer) {
      let dbCustomer = await Customer.findById(customer._id)
      console.log(dbCustomer)
      if (dbCustomer && dbCustomer._id) {
        return await Tag.find({ customer: dbCustomer._id }).lean()
      } else {
        return []
      }
    },
  },

  getters: {},
}

export default TagStore
