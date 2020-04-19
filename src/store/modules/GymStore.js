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
  },

  actions: {
    loadGym({ commit }, pos) {
      return new Promise((resolve, reject) => {
        Gym.findOne({ _id: pos.gym }, (err, gym) => {
          if (err) reject(err)
          commit('setGym', gym._id)
          resolve(gym)
        })
      })
    },

    loadAllGyms({ commit }) {
      return new Promise((resolve, reject) => {
        Gym.find()
          .populate('user')
          .lean()
          .exec((err, gyms) => {
            if (err) reject(err)
            commit('setGyms', gyms)
            resolve(gyms)
          })
      })
    },

    loadGymById(context, id) {
      return new Promise((resolve, reject) => {
        Gym.findOne({ _id: id }, (err, gym) => {
          if (err) reject(err)
          resolve(gym)
        })
      })
    },

    createGym(context, data) {
      let gym = new Gym(data)
      return new Promise((resolve, reject) => {
        gym.save((err, savedGym) => {
          if (err) {
            reject(err)
          } else {
            resolve(savedGym.toObject({ getters: true }))
          }
        })
      })
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
  },
}

export default GymStore
