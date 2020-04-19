import Vue from 'vue'
import * as mongoose from 'mongoose'
import config from '@/config/config'
import Store from 'electron-store'
const ApplicationStore = {
  state: {
    loggedIn: false,
    connecting: true,
    connected: false,
    posUuid: '',
    showSetupButton: false,
    fileStore: undefined,
  },

  mutations: {
    setupFileStore(state) {
      state.fileStore = new Store()
    },

    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn
    },

    setConnecting(state, connecting) {
      state.connecting = connecting
    },

    setConnected(state, connected) {
      state.connected = connected
    },

    setPosUuid(state, uuid) {
      state.posUuid = uuid
    },

    showSetupButton(state, show) {
      state.showSetupButton = show
    },
  },

  actions: {
    loadConfiguration({ commit }) {
      commit('setupFileStore')
    },

    initMongoConnection({ commit }, { mongoDbHost, mongoDbUser, mongoDbPassword, mongoDbDatabase, posUuid }) {
      commit('setConnecting', true)
      commit('setPosUuid', posUuid)
      return new Promise((resolve, reject) => {
        mongoose
          .connect(`mongodb://${mongoDbUser}:${mongoDbPassword}@${mongoDbHost}/${mongoDbDatabase}`, {
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
              commit('setConnecting', false)
              reject(error)
            }
          )
      })
    },

    logout({ commit }) {
      commit('setCurrentUser', {})
      commit('setLoggedIn', false)
    },
  },

  getters: {
    loggedIn: state => state.loggedIn,

    connecting: state => state.connecting,

    connected: state => state.connected,

    showSetupButton: state => state.showSetupButton,

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
