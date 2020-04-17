let config = {
  user: {
    roles: {
      admin: 'admin',
      employee: 'employee',
    },
  },
  vatRegimes: [0.21, 0.12],
  currencies: [
    { sign: '€', text: 'EUR' },
    { sign: '$', text: 'USD' },
  ],
  layout: {
    defaultRows: 6,
    defaultCols: 8,
    maxPages: 3,
    maxRows: 8,
    maxCols: 10,
  },
  pageIcons: ['mountain', 'building', 'utensils', 'glass-cheers', 'candy-cane', 'chalkboard-teacher', 'users'],
  transaction: {
    paymentMethods: {
      cash: 'cash',
      card: 'card',
      creditCard: 'creditCard',
    },
  },
}

export default config
