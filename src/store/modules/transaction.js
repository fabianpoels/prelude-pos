import Transaction from '@/models/transaction'

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
      commit('addTransaction', transaction.toObject({ getters: true }))
    },
  },

  getters: {},
}

export default TransactionStore
