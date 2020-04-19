import { DateTime } from 'luxon'

let helpers = {
  formatPrice(settings, amount, currencyAsText = false, precision = 2) {
    const negativeSign = amount < 0 ? '-' : ''
    const delimiter = settings.number_delimiter || '.'
    const separator = settings.number_separator || ','
    const currencySign = settings ? settings.currency_sign || '€' : '€'
    const currencyText = settings ? settings.currency_text || 'EUR' : 'EUR'

    let i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(precision))).toString()
    let j = i.length > 3 ? i.length % 3 : 0

    return (
      (currencyAsText ? '' : currencySign + ' ') +
      negativeSign +
      (j ? i.substr(0, j) + delimiter : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + delimiter) +
      (precision
        ? separator +
          Math.abs(amount - i)
            .toFixed(precision)
            .slice(2)
        : '') +
      (currencyAsText ? ' ' + currencyText : '')
    )
  },

  formatDecimal(settings, dec, precision = 0) {
    const negativeSign = dec < 0 ? '-' : ''
    const delimiter = settings.number_delimiter || '.'
    const separator = settings.number_separator || ','

    let i = parseInt((dec = Math.abs(Number(dec) || 0).toFixed(precision))).toString()
    let j = i.length > 3 ? i.length % 3 : 0
    return (
      negativeSign +
      (j ? i.substr(0, j) + delimiter : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + delimiter) +
      (precision
        ? separator +
          Math.abs(dec - i)
            .toFixed(precision)
            .slice(2)
        : '')
    )
  },

  formatDate(settings, dateTime) {
    if (!dateTime) return ''
    if (DateTime.isDateTime(dateTime)) {
      if (settings.dateFormat) return dateTime.toFormat(settings.dateFormat)
      return dateTime.toFormat('dd/MM/yyyy')
    } else {
      console.error('Using deprecated date obj in formatDate()', dateTime)
    }
  },

  formatDateTime(settings, dateTime) {
    if (!dateTime) return ''
    if (DateTime.isDateTime(dateTime)) {
      if (settings.dateTimeFormat) return dateTime.toFormat(settings.dateTimeFormat)
      return dateTime.toFormat('dd/MM/yyyy HH:mm:ss')
    } else {
      console.error('Using deprecated date obj in formatDate()', dateTime)
    }
  },

  formatTime(settings, dateTime) {
    if (!dateTime) return ''
    if (DateTime.isDateTime(dateTime)) {
      if (settings.dateTimeFormat) return dateTime.toFormat(settings.dateTimeFormat)
      return dateTime.toFormat('HH:mm:ss')
    } else {
      console.error('Using deprecated date obj in formatDate()', dateTime)
    }
  },

  formatVat(vat) {
    return `${vat * 100} %`
  },
}

let helperPlugin = {
  install(Vue) {
    Vue.helpers = helpers
    Vue.prototype.$helpers = helpers
  },
}

export default helperPlugin
