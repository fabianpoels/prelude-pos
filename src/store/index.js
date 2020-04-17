import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

// import modules from './modules'
import ApplicationStore from '@/store/modules/application'
import BusinessUnitStore from '@/store/modules/business_unit'
import CartStore from '@/store/modules/cart'
import CategoryStore from '@/store/modules/category'
import GymStore from '@/store/modules/gym'
import ItemStore from '@/store/modules/item'
import PageStore from '@/store/modules/page'
import PosStore from '@/store/modules/pos'
import PriceStore from '@/store/modules/price'
import TransactionStore from '@/store/modules/transaction'
import UserStore from '@/store/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ApplicationStore,
    BusinessUnitStore,
    CartStore,
    CategoryStore,
    GymStore,
    ItemStore,
    PageStore,
    PosStore,
    PriceStore,
    TransactionStore,
    UserStore,
  },
  plugins: [
    // createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
})
