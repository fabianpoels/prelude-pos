import Vue from 'vue'
import Router from 'vue-router'

import CustomerAccountPage from '@/components/customerAccount/CustomerAccountPage'
import CustomerPage from '@/components/customer/CustomerPage'
import EmptyView from '@/components/EmptyView'
import GymSettings from '@/components/admin/GymSettings'
import ManageCategories from '@/components/admin/ManageCategories'
import ManageItems from '@/components/admin/ManageItems'
import ManageUsers from '@/components/admin/users/ManageUsers'
import PagesSetup from '@/components/admin/PagesSetup'
import PageView from '@/components/page/PageView'
import SetupView from '@/components/setup/SetupView'
import TransactionPage from '@/components/transaction/TransactionPage'

import store from '@/store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'root',
      component: EmptyView,
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView,
    },
    {
      path: '/page-view/:pageId',
      name: 'page-view',
      component: PageView,
      beforeEnter: (to, from, next) => {
        if (store.getters.loggedIn) {
          next()
        }
        next(false)
      },
    },
    {
      path: '/customerAccounts/',
      name: 'customerAccounts',
      component: CustomerAccountPage,
      beforeEnter: (to, from, next) => {
        if (store.getters.loggedIn) {
          next()
        }
        next(false)
      },
    },
    {
      path: '/transactions/',
      name: 'transactions',
      component: TransactionPage,
      beforeEnter: (to, from, next) => {
        if (store.getters.loggedIn) next()
        next(false)
      },
    },
    {
      path: '/customers/',
      name: 'customers',
      component: CustomerPage,
      beforeEnter: (to, from, next) => {
        if (store.getters.loggedIn) next()
        next(false)
      },
    },
    {
      path: '/manage-categories',
      name: 'manage-categories',
      component: ManageCategories,
      beforeEnter: (to, from, next) => {
        if (store.getters.isAdmin) {
          next()
        }
        next(false)
      },
    },
    {
      path: '/manage-items',
      name: 'manage-items',
      component: ManageItems,
      beforeEnter: (to, from, next) => {
        if (store.getters.isAdmin) {
          next()
        }
        next(false)
      },
    },
    {
      path: '/manage-users',
      name: 'manage-users',
      component: ManageUsers,
      beforeEnter: (to, from, next) => {
        if (store.getters.isAdmin) {
          next()
        }
        next(false)
      },
    },
    {
      path: '/gym-settings',
      name: 'gym-settings',
      component: GymSettings,
      beforeEnter: (to, from, next) => {
        if (store.getters.isAdmin) {
          next()
        }
        next(false)
      },
    },
    {
      path: '/pages-setup',
      name: 'pages-setup',
      component: PagesSetup,
      beforeEnter: (to, from, next) => {
        if (store.getters.isAdmin) {
          next()
        }
        next(false)
      },
    },
  ],
})
