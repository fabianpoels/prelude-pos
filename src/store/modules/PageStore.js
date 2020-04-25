import config from '@/config/config'

import Vue from 'vue'
import Page from '@/models/page'

const PageStore = {
  state: {
    pages: [],
  },

  mutations: {
    setPages(state, pages) {
      state.pages = pages
    },

    addPage(state, page) {
      state.pages.push(page)
    },

    updatePage(state, page) {
      Vue.set(
        state.pages,
        state.pages.findIndex(p => p._id === page._id),
        page
      )
    },

    deletePage(state, page) {
      state.pages.splice(
        state.pages.findIndex(p => p._id === page._id),
        1
      )
    },
  },

  actions: {
    async loadPages({ commit }, pos) {
      let pages = await Page.find({ _id: { $in: pos.pages } }).lean()
      commit('setPages', pages)
    },

    async createPage({ commit, dispatch }, page) {
      let dbPage = new Page(page)
      dbPage.rows = config.layout.defaultRows
      dbPage.cols = config.layout.defaultCols
      await dbPage.save()
      page = dbPage.toObject({ getters: true })
      await dispatch('addPageToPos', page)
      commit('addPage', page)
    },

    async updatePage({ commit }, page) {
      let dbPage = await Page.findByIdAndUpdate(page._id, page, { new: true })
      commit('updatePage', dbPage.toObject({ getters: true }))
    },

    async addButtonToPage({ commit }, { page, button }) {
      let dbPage = await Page.findById(page._id)
      dbPage.buttons.push(button)
      await dbPage.save()
      commit('updatePage', dbPage.toObject({ getters: true }))
    },

    async removeButtonFromPage({ commit }, { page, button }) {
      let dbPage = await Page.findById(page._id)
      let index = dbPage.buttons.findIndex(b => b.key === button.key)
      if (index > -1) {
        dbPage.buttons.splice(index, 1)
        await dbPage.save()
        commit('updatePage', dbPage.toObject({ getters: true }))
      }
    },

    async deletePage({ commit, dispatch }, page) {
      await Page.findByIdAndDelete(page._id)
      await dispatch('removePageFromPos', page)
      commit('deletePage', page)
    },
  },

  getters: {
    pages: state => state.pages,
    orderedPages: (getters, rootGetters) => rootGetters.pos.pages.filter(id => getters.pages.some(p => p._id === id)).map(id => getters.pages.find(p => p._id === id)),
    pageById: getters => id => getters.pages.find(p => p._id === id),
    removeRowAllowed: () => page => page.rows > 1 && !page.buttons.some(button => parseInt(button.key.split(':')[1]) === page.rows),
    removeColAllowed: () => page => page.cols > 1 && !page.buttons.some(button => parseInt(button.key.split(':')[0]) === page.cols),
  },
}

export default PageStore
