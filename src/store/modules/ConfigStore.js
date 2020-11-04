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
    tagReader: undefined,
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

    setTagReader(state, tagReader) {
      state.tagReader = tagReader
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
      let tagReader = getters.fileStore.get('tagReader')
      if (tagReader && tagReader.vendorId && tagReader.productId) commit('setTagReader', tagReader)
    },

    saveDbConfig({ commit, getters }, config) {
      getters.fileStore.set('dbConfig', config)
      commit('setDbConfig', config)
    },

    savePosUuid({ commit, getters }, posUuid) {
      getters.fileStore.set('posUuid', posUuid)
      commit('setPosUuid', posUuid)
    },

    saveTagReader({ commit, getters, dispatch }, tagReader) {
      commit('setTagReader', tagReader)
      if (getters.tagReader && getters.tagReader !== null) {
        getters.fileStore.set('tagReader', tagReader)
        dispatch('startNfcListen')
      }
    },
  },

  getters: {
    configLoaded: state => state.configLoaded,
    fileStore: state => state.fileStore,
    dbConfig: state => state.dbConfig,
    posUuid: state => state.posUuid,
    tagReader: state => state.tagReader,
  },
}

export default ConfigStore
