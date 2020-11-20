import Entry from '@/models/entry'
import { DateTime } from 'luxon'

const EntryStore = {
  state: {
    entries: [],
  },

  mutations: {
    addEntry(state, entry) {
      state.entries.push(entry)
    },
  },

  actions: {
    async logEntry({ commit }, { user, customer, item, price, datetime, isCorrection = false }) {
      let entry = new Entry({
        user: user,
        customer: customer,
        item: item,
        price: price,
        datetime: datetime,
        isCorrection: isCorrection,
      })
      await entry.save()
      commit('addEntry', entry.toObject({ getters: true }))
    },
  },

  getters: {
    sortedEntries: state => [...state.entries].sort((a, b) => DateTime.fromJSDate(b.datetime) - DateTime.fromJSDate(a.datetime)),
  },
}

export default EntryStore
