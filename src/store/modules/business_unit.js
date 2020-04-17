import Vue from 'vue'
import BusinessUnit from '@/models/businessUnit'

const BusinessUnitStore = {
  state: {
    businessUnits: [],
  },

  mutations: {
    addBusinessUnit(state, businessUnit) {
      state.businessUnits.push(businessUnit)
    },

    setBusinessUnits(state, businessUnits) {
      state.businessUnits = businessUnits
    },

    updateBusinessUnit(state, businessUnit) {
      Vue.set(
        state.businessUnits,
        state.businessUnits.findIndex(bu => bu._id === businessUnit._id),
        businessUnit
      )
    },

    deleteBusinessUnit(state, businessUnit) {
      state.businessUnits.splice(
        state.businessUnits.findIndex(bu => bu._id === businessUnit._id),
        1
      )
    },
  },

  actions: {
    async createBusinessUnit({ commit }, { data, gym }) {
      let businessUnit = new BusinessUnit(data)
      businessUnit.gym = gym._id
      await businessUnit.save()
      commit('addBusinessUnit', businessUnit.toObject({ getters: true }))
    },

    async updateBusinessUnit({ commit }, businessUnit) {
      let dbUnit = await BusinessUnit.findByIdAndUpdate(businessUnit._id, businessUnit, { new: true })
      commit('updateBusinessUnit', dbUnit.toObject({ getters: true }))
    },

    archiveBusinessUnit({ getters, dispatch }, businessUnit) {
      if (getters.canArchiveBusinessUnit(businessUnit)) {
        businessUnit.archived = true
        dispatch('updateBusinessUnit', businessUnit)
      }
    },

    async deleteBusinessUnit({ commit, getters }, businessUnit) {
      if (getters.canDeleteBusinessUnit(businessUnit)) {
        await BusinessUnit.deleteOne({ _id: businessUnit._id })
        commit('deleteBusinessUnit', businessUnit)
      }
    },
  },

  getters: {
    businessUnits: state => state.businessUnits.filter(bu => bu.archived === false),
    canArchiveBusinessUnit: (state, getters) => businessUnit => getters.categoriesForBusinessUnit(businessUnit).length === 0,
    canDeleteBusinessUnit: (state, getters, rootState) => businessUnit =>
      rootState.CategoryStore.categories.filter(c => c.businessUnit === businessUnit._id).length === 0,
  },
}

export default BusinessUnitStore
