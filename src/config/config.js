let config = {
  defaultColors: [
    '#16A765',
    '#42D692',
    '#4986E7',
    '#7BD148',
    '#92E1C0',
    '#9A9CFF',
    '#9FC6E7',
    '#9FE1E7',
    '#A47AE2',
    '#AC725E',
    '#B3DC6C',
    '#B99AFF',
    '#CABDBF',
    '#CCA6AC',
    '#CD74E6',
    '#D06B64',
    '#F691B2',
    '#F83A22',
    '#F96143',
    '#FAD165',
    '#FBE983',
    '#FF7733',
    '#FFAD46',
  ],
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
    maxPages: 10,
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
