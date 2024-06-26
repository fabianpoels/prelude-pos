import Vue from 'vue'
import * as mongoose from 'mongoose'
import config from '@/config/config'
import User from '@/models/user'
import HID from 'node-hid'

// const pcsclite = require('pcsclite')
// const pcsc = pcsclite()

const ApplicationStore = {
  state: {
    loggedIn: false,
    connecting: false,
    connected: false,
  },

  mutations: {
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn
    },

    setConnecting(state, connecting) {
      state.connecting = connecting
    },

    setConnected(state, connected) {
      state.connected = connected
    },
  },

  actions: {
    async startApplication({ dispatch, getters }) {
      await dispatch('clearStores')
      await dispatch('loadConfig')
      if (getters.configLoaded) {
        await dispatch('connectMongoose', getters.dbConfig)
        if (getters.connected) {
          await dispatch('loadAllGyms')
          let pos = await dispatch('loadPos', getters.posUuid)
          await dispatch('startNfcListen', getters.tagReader)
          await dispatch('startEidListen')
          if (pos && pos.id === getters.posUuid) {
            await dispatch('loadGymById', pos.gym.id)
            await dispatch('loadPosData')
            return getters.users.length > 0
          }
        }
      }
      return false
    },

    connectMongoose({ commit, dispatch }, { host, db, user, password, connectionString, connectionMode }) {
      commit('setConnecting', true)
      return new Promise(resolve => {
        mongoose
          .connect(connectionMode === 'custom' ? `mongodb://${connectionString}` : `mongodb://${user}:${password}@${host}/${db}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
          })
          .then(
            () => {
              commit('setConnecting', false)
              commit('setConnected', true)
              resolve()
            },
            error => {
              console.log(`connection error: ${error}`)
              console.error(error)
              commit('setConnecting', false)
              resolve(error)
            }
          )
          .catch(error => {
            console.log(`connection error: ${error}`)
            console.error(error)
            commit('setConnecting', false)
            resolve(error)
          })
        mongoose.connection.on('disconnected', () => {
          commit('setConnected', false)
          dispatch('logout')
        })
      })
    },

    clearStores({ commit }) {
      commit('setBusinessUnits', [])
      commit('clearCartStore')
      commit('setCategories', [])
      commit('clearGymStore')
      commit('setItems', [])
      commit('setPages', [])
      commit('clearPosStore')
      commit('setPrices', [])
      commit('clearSplitCheckoutStore')
      commit('setTransactions', [])
      commit('clearUserStore')
      commit('setCustomers', [])
    },

    async login({ commit, getters }, { identifier, password }) {
      let loggedIn = false
      let user = getters.userByIdentifier(identifier)
      if (user) {
        let dbUser = await User.findById(user._id)
        if ((await dbUser.validPassword(password)) && dbUser.enabled) {
          commit('setCurrentUser', dbUser.toObject({ virtuals: true }))
          commit('setLoggedIn', true)
          loggedIn = true
        }
      }
      return loggedIn
    },

    logout({ commit }) {
      commit('setCurrentUser', {})
      commit('setLoggedIn', false)
    },
  },

  getters: {
    devices: () => HID.devices(),
    loggedIn: state => state.loggedIn,
    connecting: state => state.connecting,
    connected: state => state.connected,
    vatFormOptions: () =>
      config.vatRegimes.map(x => {
        return {
          value: x,
          text: Vue.helpers.formatVat(x),
        }
      }),
  },
}

export default ApplicationStore
