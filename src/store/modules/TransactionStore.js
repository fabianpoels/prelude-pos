import Transaction from '@/models/transaction'
import { DateTime } from 'luxon'

const TransactionStore = {
  state: {
    transactions: [],
  },

  mutations: {
    setTransactions(state, transactions) {
      state.transactions = transactions
    },

    addTransaction(state, transaction) {
      if (!state.transactions.some(t => t._id === transaction._id)) {
        state.transactions.push(transaction)
      }
    },
  },

  actions: {
    async loadDailyTransactions({ commit }) {
      let startOfDay = DateTime.local().startOf('day')
      let transactions = await Transaction.find({ createdAt: { $gte: startOfDay.toJSDate() } }).lean()
      commit('setTransactions', transactions)
    },

    async createTransactionFromCartItems({ commit, rootGetters }, { cartItems, paymentMethod }) {
      let transaction = new Transaction({
        gym: rootGetters.gym._id,
        pos: rootGetters.pos._id,
        user: rootGetters.currentUser._id,
        priceIds: cartItems.map(ci => ci.priceId),
        prices: cartItems.flatMap(cartItem => Array(cartItem.amount).fill(rootGetters.priceById(cartItem.priceId))),
        paymentMethod: paymentMethod,
      })
      await transaction.save()
      let t = transaction.toObject({ getters: true })
      commit('addTransaction', t)
      return t
    },
  },

  getters: {
    transactions: state => state.transactions,
    orderedTransactions: getters => [...getters.transactions].sort((a, b) => b.number - a.number),
  },
}

export default TransactionStore
