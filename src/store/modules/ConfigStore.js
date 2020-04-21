import Store from 'electron-store'

const ConfigStore = {
  state: {
    fileStore: undefined,
    loadingConfig: false,
    configLoaded: false,
    dbConfig: {
      host: '',
      db: '',
      user: '',
      password: '',
      connectionString: '',
      connectionMode: 'standard',
    },
    posUuid: undefined,
  },

  mutations: {
    setupFileStore(state) {
      state.fileStore = new Store()
    },

    showConfigModal(state, show) {
      state.showConfigModal = show
    },

    setDbConfig(state, config) {
      state.dbConfig = config
    },

    setConfigLoaded(state, loaded) {
      state.configLoaded = loaded
    },

    setPosUuid(state, uuid) {
      state.posUuid = uuid
    },
  },

  actions: {
    loadConfig({ commit, getters }) {
      commit('setupFileStore')
      let dbConfig = getters.fileStore.get('dbConfig')
      commit('setPosUuid', getters.fileStore.get('posUuid'))
      if (dbConfig && dbConfig.host && dbConfig.db && dbConfig.user && dbConfig.password) {
        commit('setDbConfig', dbConfig)
        commit('setConfigLoaded', true)
      }
    },

    saveConfig({ commit, getters }, config) {
      getters.fileStore.set('dbConfig', config)
      commit('setDbConfig', config)
    },
  },

  getters: {
    configLoaded: state => state.configLoaded,
    fileStore: state => state.fileStore,
    dbConfig: state => state.dbConfig,
    posUuid: state => state.posUuid,
  },
}

export default ConfigStore
