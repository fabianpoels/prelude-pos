import Vue from 'vue'
import Gym from '@/models/gym'
const GymStore = {
  state: {
    gym: {},
    gyms: [],
  },

  mutations: {
    setGym(state, gym) {
      state.gym = gym
    },

    setGyms(state, gyms) {
      state.gyms = gyms
    },

    addGym(state, gym) {
      state.gyms.push(gym)
    },

    updateGym(state, gym) {
      Vue.set(
        state.gyms,
        state.gyms.findIndex(g => g._id === gym._id),
        gym
      )
      if (state.gym._id === gym._id) {
        state.gym = gym
      }
    },

    clearGymStore(state) {
      state.gym = {}
      state.gyms = []
    },
  },

  actions: {
    async loadGymById({ commit }, gymId) {
      let gym = await Gym.findById(gymId)
        .populate({ path: 'users', model: 'User' })
        .lean()
      if (gym) {
        commit('setGym', gym)
        commit('setUsers', gym.users)
      }
    },

    async loadAllGyms({ commit }) {
      let gyms = await Gym.find()
        .populate({ path: 'users', model: 'User' })
        .lean()
      if (Array.isArray(gyms)) {
        commit('setGyms', gyms)
      }
    },

    async createGym({ commit }, data) {
      let gym = new Gym(data)
      await gym.save()
      gym = gym.toObject({ getters: true })
      commit('addGym', gym)
      return gym
    },

    async updateGym({ commit }, gym) {
      let dbGym = await Gym.findByIdAndUpdate(gym._id, gym, { new: true })
      commit('updateGym', dbGym.toObject({ getters: true }))
    },

    addPosToGym(context, { pos, gym }) {
      return new Promise((resolve, reject) => {
        Gym.findOne({ _id: gym.id }).then(dbGym => {
          dbGym.poss.push(pos._id)
          dbGym.save((err, savedGym) => {
            if (err) reject(err)
            resolve(savedGym)
          })
        })
      })
    },
  },

  getters: {
    gym: state => state.gym,
    gymById: state => id => state.gyms.find(gym => gym._id === id),
    gyms: state => state.gyms,
    gymLoaded: state => !!state.gym && !!state.gym._id && state.gym._id !== '',
  },
}

export default GymStore
