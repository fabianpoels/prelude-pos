import Vue from 'vue'
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
        await Tag.findOneAndUpdate({ tagId: tag.tagId }, { customer: tag.customer }, { new: true })
        commit('deleteTag', tag)
      }
    },

    async readTag({ commit }, tagId) {
      let dbTag = await Tag.findOneAndUpdate({ tagId: tagId }, { tagId: tagId }, { new: true, upsert: true })
      dbTag = dbTag.toObject({ getters: true })
      commit('addTag', dbTag)
    },
  },

  getters: {
    tags: state => state.tags,
  },
}

export default TagStore
