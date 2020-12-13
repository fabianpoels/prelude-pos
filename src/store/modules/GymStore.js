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
        state.gyms.findIndex(g => g.id === gym.id),
        gym
      )
      if (state.gym.id === gym.id) {
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
        .lean({ virtuals: true })
      if (gym) {
        commit('setGym', gym)
        commit('setUsers', gym.users)
      }
    },

    async loadAllGyms({ commit }) {
      let gyms = await Gym.find()
        .populate({ path: 'users', model: 'User' })
        .lean({ virtuals: true })
      if (Array.isArray(gyms)) {
        commit('setGyms', gyms)
      }
    },

    async createGym({ commit }, data) {
      let gym = new Gym(data)
      await gym.save()
      gym = gym.toObject({ virtuals: true })
      commit('addGym', gym)
      return gym
    },

    async updateGym({ commit }, gym) {
      let dbGym = await Gym.findByIdAndUpdate(gym._id, gym, { new: true })
      commit('updateGym', dbGym.toObject({ virtuals: true }))
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
    gymById: state => id => state.gyms.find(gym => gym.id === id),
    gyms: state => state.gyms,
    gymLoaded: state => !!state.gym && !!state.gym.id && state.gym.id !== '',
  },
}

export default GymStore
