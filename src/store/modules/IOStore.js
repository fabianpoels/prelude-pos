import { KeyboardLines } from 'node-hid-stream'
const eid = require('belgium-eid')
const reader = eid()

const IOStore = {
  state: {
    idCard: null,
  },

  mutations: {
    setIdCard(state, card) {
      state.idCard = card
    },

    removeIdCard(state) {
      state.idCard = null
    },
  },

  actions: {
    async startNfcListen({ dispatch }, { vendorId, productId }) {
      if (vendorId && productId) {
        try {
          let hidstream = new KeyboardLines({ vendorId: vendorId, productId: productId })
          hidstream.on('data', data => {
            dispatch('readTag', data.replace(/\s+/g, ''))
          })
        } catch (e) {
          console.error(e)
        }
      }
    },

    async startEidListen({ commit }) {
      reader.on('card-inserted', card => {
        commit('setIdCard', card)
      })
      reader.on('error', (reader, error) => {
        console.log(error)
      })
    },
  },

  getters: {
    idCard: state => state.idCard,
  },
}

export default IOStore
