import Vue from 'vue'
import * as mongoose from 'mongoose'
import config from '@/config/config'
import User from '@/models/user'
import HID from 'node-hid'
import { KeyboardLines } from 'node-hid-stream'

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
          if (pos && pos._id === getters.posUuid) {
            await dispatch('loadGymById', pos.gym._id)
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
        let dbUser = await User.findOne({ _id: user._id })
        if ((await dbUser.validPassword(password)) && dbUser.enabled) {
          commit('setCurrentUser', user)
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

    async startNfcListen({ dispatch }, { vendorId, productId }) {
      if (vendorId && productId) {
        try {
          let hidstream = new KeyboardLines({ vendorId: vendorId, productId: productId })
          hidstream.on('data', data => {
            dispatch('readTag', data.replace(/\s+/g, ''))
          })
        } catch (e) {
          console.error(e)
        }
      }
    },
  },

  getters: {
    devices: () => HID.devices(),
    loggedIn: state => state.loggedIn,
    nfcData: state => state.nfcData,
    connecting: state => state.connecting,
    connected: state => state.connected,
    scannedTags: (state, getters) => getters.nfcData.length,
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
