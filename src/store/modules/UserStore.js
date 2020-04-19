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
      await dbGym.save()
    },

    async login({ commit, getters }, { identifier, password }) {
      let login = false
      let user = getters.userByIdentifier(identifier)
      if (user) {
        let dbUser = await User.findOne({ _id: user._id })
        if (await dbUser.validPassword(password)) {
          commit('setCurrentUser', user)
          commit('setLoggedIn', true)
          login = true
        }
      }
      return Promise.resolve(login)
    },
  },

  getters: {
    users: state => state.users,
    userByIdentifier: state => identifier => state.users.find(u => u.identifier === identifier),
    userById: getters => id => getters.users.find(u => u._id === id),
    isAdmin: state => state.currentUser.role && state.currentUser.role === 'admin',
    currentUser: state => state.currentUser,
  },
}

export default UserStore
