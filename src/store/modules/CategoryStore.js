import Vue from 'vue'
import Category from '@/models/category'

const CategoryStore = {
  state: {
    categories: [],
  },

  mutations: {
    setCategories(state, categories) {
      state.categories = categories
    },

    addCategory(state, category) {
      state.categories.push(category)
    },

    updateCategory(state, category) {
      Vue.set(
        state.categories,
        state.categories.findIndex(c => c.id === category.id),
        category
      )
    },

    deleteCategory(state, category) {
      state.categories.splice(
        state.categories.findIndex(c => c.id === category.id),
        1
      )
    },
  },

  actions: {
    async createCategory({ commit }, { data, businessUnit, gym }) {
      let category = new Category(data)
      category.gym = gym._id
      category.businessUnit = businessUnit._id
      await category.save()
      commit('addCategory', category.toObject({ virtuals: true }))
    },

    async updateCategory({ commit }, category) {
      let dbCategory = await Category.findByIdAndUpdate(category._id, category, { new: true })
      commit('updateCategory', dbCategory.toObject({ virtuals: true }))
    },

    async archiveCategory({ getters, dispatch }, category) {
      if (getters.canArchiveCategory(category)) {
        category.archived = true
        await dispatch('updateCategory', category)
      }
    },

    async deleteCategory({ commit }, category) {
      await Category.deleteOne({ _id: category._id })
      commit('deleteCategory', category)
    },
  },

  getters: {
    categories: state => state.categories.filter(c => c.archived === false),
    categoryById: state => id => state.categories.find(c => c.id === id),
    categoriesForBusinessUnit: (state, getters) => businessUnit => getters.categories.filter(c => c.businessUnit.toString() === businessUnit.id),
    canArchiveCategory: (state, getters) => category => getters.itemsForCategory(category).length === 0,
    canDeleteCategory: (state, getters, rootState) => category => rootState.ItemStore.items.filter(i => i.category.toString() === category.id).length === 0,
  },
}

export default CategoryStore
