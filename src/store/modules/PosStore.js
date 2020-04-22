import { v4 as uuidv4 } from 'uuid'
import Pos from '@/models/pos'
import BusinessUnit from '@/models/businessUnit'
import Category from '@/models/category'

const PosStore = {
  state: {
    pos: {},
    poss: [],
    dataLoaded: false,
  },

  mutations: {
    setPos(state, pos) {
      state.pos = pos
    },

    setPoss(state, poss) {
      state.poss = poss
    },

    setDataLoaded(state, loaded) {
      state.dataLoaded = loaded
    },

    clearPosStore(state) {
      state.pos = {}
      state.poss = []
      state.dataLoaded = false
    },
  },

  actions: {
    async loadPos({ commit }, uuid) {
      let poss = await Pos.find()
        .populate([{ path: 'gym', model: 'Gym', populate: { path: 'users', model: 'User' } }])
        .lean()
      commit('setPoss', poss)
      let pos = poss.find(p => p._id === uuid)
      if (pos) {
        commit('setPos', pos)
        return pos
      }
    },

    async loadPosData({ commit, dispatch, getters }) {
      let businessUnits = await BusinessUnit.find({ gym: getters.pos.gym._id }).lean()
      commit('setBusinessUnits', businessUnits)
      let categories = await Category.find({ businessUnit: { $in: businessUnits.map(bu => bu._id) } }).lean()
      commit('setCategories', categories)
      await dispatch('loadPages', getters.pos)
      await dispatch('loadItems', categories)
      await dispatch('loadPrices', getters.items)
      await dispatch('loadDailyTransactions')
      commit('setDataLoaded', true)
    },

    async createPos({ commit }, data) {
      let pos = new Pos(data)
      await pos.save()
      pos = pos.toObject({ getters: true })
      commit('setPos', pos)
      return pos
    },

    async updatePos({ commit }, pos) {
      let dbPos = await Pos.findByIdAndUpdate(pos._id, pos, { new: true })
      commit('setPos', dbPos.toObject({ getters: true }))
    },

    async addPageToPos({ commit, getters }, page) {
      let dbPos = await Pos.findById(getters.pos._id)
      if (!dbPos.pages.includes(page._id)) {
        dbPos.pages.push(page._id)
        await dbPos.save()
        commit('setPos', dbPos.toObject({ getters: true }))
      }
    },

    async removePageFromPos({ dispatch, getters }, page) {
      let pos = { ...getters.pos }
      pos.pages = pos.pages.filter(p => p._id !== page._id)
      dispatch('updatePos', pos)
    },
  },

  getters: {
    pos: state => state.pos,
    dataLoaded: state => state.dataLoaded,
    posById: state => id => state.poss.find(p => p._id === id),
    posLoaded: state => state.pos && state.pos._id !== '',
    newUuid: () => uuidv4(),
  },
}

export default PosStore
