import Vue from 'vue'
import { DateTime } from 'luxon'

import Customer from '@/models/customer'
import Tag from '@/models/tag'

const TagStore = {
  state: {
    tags: [],
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
  },

  actions: {
    async assignTag({ commit, getters }, tag) {
      if (getters.customerExistsById(tag.customer)) {
        await Tag.findOneAndUpdate({ tagId: tag.tagId }, { customer: tag.customer, dateAssigned: DateTime.local().toJSDate() }, { new: true })
        commit('deleteTag', tag)
      }
    },

    async unassignTag({ commit }, tag) {
      await Tag.findOneAndUpdate({ tagId: tag.tagId }, { customer: null })
      commit('deleTag', tag)
    },

    // eslint-disable-next-line no-empty-pattern
    async loadTagsForCustomer({}, customer) {
      let dbCustomer = await Customer.findById(customer._id)
      if (dbCustomer && dbCustomer._id) {
        return await Tag.find({ customer: dbCustomer._id }).lean()
      } else {
        return []
      }
    },

    async readTag({ commit }, tagId) {
      let dbTag = await Tag.findOneAndUpdate({ tagId: tagId }, { tagId: tagId, lastScanned: DateTime.local().toJSDate() }, { new: true, upsert: true })
      dbTag = dbTag.toObject({ getters: true })
      commit('addTag', dbTag)
    },
  },

  getters: {
    scannedTags: state => state.tags,
  },
}

export default TagStore
