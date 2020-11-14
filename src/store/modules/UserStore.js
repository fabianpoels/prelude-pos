import Vue from 'vue'
import User from '@/models/user'
import Gym from '@/models/gym'
import config from '@/config/config'
const UserStore = {
  state: {
    currentUser: {},
    users: [],
  },

  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user
    },

    setUsers(state, users) {
      state.users = users
    },

    addUser(state, user) {
      if (!state.users.some(u => u._id === user._id)) {
        state.users.push(user)
      }
    },

    updateUser(state, user) {
      Vue.set(
        state.users,
        state.users.findIndex(c => c._id === user._id),
        user
      )
      if (user._id === state.currentUser._id) state.currentUser = user
    },

    clearUserStore(state) {
      state.currentUser = {}
      state.users = []
    },
  },

  actions: {
    async createFirstUser({ commit }, { user, gym }) {
      user.role = config.user.roles.admin
      user.password = await User.getHashedPassword(user.password)
      let dbGym = await Gym.findOne({ _id: gym._id })
      let newUser = new User(user)
      newUser.gym = gym._id
      let createdUser = await newUser.save()
      commit('addUser', createdUser.toObject({ getters: true }))
      dbGym.users.push(createdUser._id)
      dbGym = await dbGym.save()
      commit('updateGym', dbGym.toObject({ getters: true }))
    },

    async createUser({ commit }, { user, gym }) {
      user.password = await User.getHashedPassword(user.password)
      let dbGym = await Gym.findOne({ _id: gym._id })
      let newUser = new User(user)
      newUser.gym = gym._id
      let createdUser = await newUser.save()
      commit('addUser', createdUser.toObject({ getters: true }))
      dbGym.users.push(createdUser._id)
      dbGym = await dbGym.save()
      commit('updateGym', dbGym.toObject({ getters: true }))
    },

    async updateUser({ commit }, user) {
      let dbUser = await User.findByIdAndUpdate(user._id, user, { new: true })
      commit('updateUser', dbUser.toObject({ getters: true }))
    },

    async changePassword({ dispatch }, user) {
      user.password = await User.getHashedPassword(user.password)
      dispatch('updateUser', user)
    },
  },

  getters: {
    users: state => state.users,
    userByIdentifier: state => identifier => state.users.find(u => u.identifier === identifier),
    userById: (state, getters) => id => getters.users.find(u => u._id === id),
    isAdmin: state => state.currentUser.role && state.currentUser.role === 'admin',
    currentUser: state => state.currentUser,
  },
}

export default UserStore
