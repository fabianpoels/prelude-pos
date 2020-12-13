import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import PortalVue from 'portal-vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import i18n from '@/helpers/localeHelper'
import helperPlugin from '@/helpers/helperPlugin'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAddressBook,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBan,
  faBirthdayCake,
  faBuilding,
  faCandyCane,
  faCashRegister,
  faChalkboardTeacher,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
  faCity,
  faCog,
  faCoins,
  faCreditCard,
  faEdit,
  faEllipsisV,
  faEnvelope,
  faGlassCheers,
  faGlobeAmericas,
  faGripLines,
  faHandHoldingUsd,
  faIdCard,
  faLongArrowAltDown,
  faMapMarkedAlt,
  faMinus,
  faMoneyBill,
  faMountain,
  faPhone,
  faPlus,
  faReceipt,
  faSave,
  faShoppingBasket,
  faTag,
  faTh,
  faTimes,
  faTrash,
  faUndo,
  faUser,
  faUsers,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faAddressBook,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBan,
  faBirthdayCake,
  faBuilding,
  faCandyCane,
  faCashRegister,
  faChalkboardTeacher,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
  faCity,
  faCog,
  faCoins,
  faCreditCard,
  faEdit,
  faEllipsisV,
  faEnvelope,
  faGlassCheers,
  faGlobeAmericas,
  faGripLines,
  faHandHoldingUsd,
  faIdCard,
  faLongArrowAltDown,
  faMapMarkedAlt,
  faMinus,
  faMoneyBill,
  faMountain,
  faPhone,
  faPlus,
  faReceipt,
  faSave,
  faShoppingBasket,
  faTag,
  faTh,
  faTimes,
  faTrash,
  faUndo,
  faUser,
  faUsers,
  faUtensils
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(PortalVue)
Vue.use(ElementUI)
Vue.use(helperPlugin)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App, {}),
}).$mount('#app')
