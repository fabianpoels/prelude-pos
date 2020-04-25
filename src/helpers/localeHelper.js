import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import messages from '@/translations'

// import cs from 'element-ui/lib/locale/lang/cs-CZ'
// import de from 'element-ui/lib/locale/lang/de'
import en from 'element-ui/lib/locale/lang/en'
// import es from 'element-ui/lib/locale/lang/es'
// import fr from 'element-ui/lib/locale/lang/fr'
// import it from 'element-ui/lib/locale/lang/it'
// import ja from 'element-ui/lib/locale/lang/ja'
// import nl from 'element-ui/lib/locale/lang/nl'

Vue.use(VueI18n)

const langs = { en } // de, it, cs, es, fr, nl, ja }

const i18n = new VueI18n({
  locale: process.env.LOCALE || 'en',
  fallbackLocale: 'en',
  messages,
})

locale.use(langs[process.env.LOCALE || 'en'])

export default i18n
