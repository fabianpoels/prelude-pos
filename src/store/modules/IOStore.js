import Vue from 'vue'
import Tag from '@/models/tag'
import { KeyboardLines } from 'node-hid-stream'
const eid = require('belgium-eid')
const reader = eid()

const IOStore = {
  state: {
    tags: [],
    idCard: null,
  },

  mutations: {
    setTags(state, tags) {
      state.tags = tags
    },

    addTag(state, tag) {
      state.tags = state.tags.filter(t => t.tagId !== tag.tagId)
      state.tags.unshift(tag)
    },

    updateTag(state, tag) {
      Vue.set(
        state.tags,
        state.tags.findIndex(i => i._id === tag._id),
        tag
      )
    },

    deleteTag(state, tag) {
      state.tags.splice(
        state.tags.findIndex(i => i._id === tag._id),
        1
      )
    },

    setIdCard(state, card) {
      state.idCard = card
    },

    removeIdCard(state) {
      state.idCard = null
    },
  },

  actions: {
    async assignTag({ commit, getters }, tag) {
      if (getters.customerExistsById(tag.customer)) {
        await Tag.findOneAndUpdate({ tagId: tag.tagId }, { customer: tag.customer }, { new: true })
        commit('deleteTag', tag)
      }
    },

    async readTag({ commit }, tagId) {
      let dbTag = await Tag.findOneAndUpdate({ tagId: tagId }, { tagId: tagId }, { new: true, upsert: true })
      dbTag = dbTag.toObject({ getters: true })
      commit('addTag', dbTag)
    },

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
    tags: state => state.tags,
    idCard: state => state.idCard,
  },
}

export default IOStore
