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
      if (!state.transactions.some(t => t.id === transaction.id)) {
        state.transactions.push(transaction)
      }
    },
  },

  actions: {
    async loadDailyTransactions({ commit, getters }) {
      // let startOfDay = DateTime.local().startOf('day')
      // let transactions = await Transaction.find({ createdAt: { $gte: startOfDay.toJSDate() } }).lean({ virtuals: true })
      let transactions = await Transaction.find({ gym: getters.gym._id, pos: getters.pos._id }).lean({ virtuals: true })
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
      let t = transaction.toObject({ virtuals: true })
      commit('addTransaction', t)
      return t
    },

    async createTransactionFromAccountItems({ commit, rootGetters }, { accountItems, paymentMethod, customer }) {
      let transaction = new Transaction({
        gym: rootGetters.gym._id,
        pos: rootGetters.pos._id,
        user: rootGetters.currentUser._id,
        customer: customer._id,
        priceIds: accountItems.map(ai => ai.price.toString()),
        prices: accountItems.flatMap(accountItem => Array(accountItem.amount).fill(rootGetters.priceById(accountItem.price.toString()))),
        paymentMethod: paymentMethod,
      })
      await transaction.save()
      let t = transaction.toObject({ virtuals: true })
      commit('addTransaction', t)
      return t
    },
  },

  getters: {
    transactions: state => state.transactions,
    orderedTransactions: (state, getters) => [...getters.transactions].sort((a, b) => b.number - a.number),
  },
}

export default TransactionStore
