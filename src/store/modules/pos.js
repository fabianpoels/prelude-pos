import Pos from '@/models/pos'
import BusinessUnit from '@/models/businessUnit'
import Category from '@/models/category'
const PosStore = {
  state: {
    pos: {},
  },

  mutations: {
    setPos(state, pos) {
      state.pos = pos
    },
  },

  actions: {
    loadCurrentPos({ getters, dispatch }) {
      return dispatch('loadPos', getters.pos)
    },

    loadPos({ commit }, uuid) {
      return new Promise((resolve, reject) => {
        Pos.findOne({ _id: uuid })
          .populate([{ path: 'gym', model: 'Gym', populate: { path: 'users', model: 'User' } }])
          .lean()
          .exec((err, pos) => {
            if (err) reject(err)
            if (pos === null) {
              reject(new Error('no pos found'))
            } else {
              commit('setPos', pos)
              resolve(pos)
            }
          })
      })
    },

    async loadPosData({ commit, dispatch, getters }, pos) {
      let businessUnits = await BusinessUnit.find({ gym: pos.gym._id }).lean()
      commit('setBusinessUnits', businessUnits)
      let categories = await Category.find({ businessUnit: { $in: businessUnits.map(bu => bu._id) } }).lean()
      commit('setCategories', categories)
      await dispatch('loadPages', pos)
      await dispatch('loadItems', categories)
      await dispatch('loadPrices', getters.items)
    },

    createPos(data) {
      return new Promise((resolve, reject) => {
        let pos = new Pos(data)
        pos.save((err, savedPos) => {
          if (err) reject(err)
          Pos.findOne({ _id: savedPos._id })
            .lean()
            .exec((err, pos) => {
              if (err) reject(err)
              resolve(pos)
            })
        })
      })
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
  },
}

export default PosStore
