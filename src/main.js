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
  faBuilding,
  faCandyCane,
  faCashRegister,
  faChalkboardTeacher,
  faCog,
  faEdit,
  faEllipsisV,
  faGlassCheers,
  faMountain,
  faPlus,
  faReceipt,
  faSave,
  faTh,
  faTimes,
  faTrash,
  faUser,
  faUsers,
  faUtensils,
  faShoppingBasket,
  faMinus,
  faHandHoldingUsd,
  faBan,
  faAddressBook,
  faUndo,
  faMoneyBill,
  faCreditCard,
  faCoins,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faLongArrowAltDown,
  faCheck,
  faGripLines,
  faEnvelope,
  faPhone,
  faMapMarkedAlt,
  faGlobeAmericas,
  faBirthdayCake,
  faCity,
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import { faCcVisa } from '@fortawesome/free-brands-svg-icons'

library.add(
  faBuilding,
  faCandyCane,
  faCashRegister,
  faChalkboardTeacher,
  faCog,
  faEdit,
  faEllipsisV,
  faGlassCheers,
  faMountain,
  faPlus,
  faReceipt,
  faSave,
  faTh,
  faTimes,
  faTrash,
  faUser,
  faUsers,
  faUtensils,
  faShoppingBasket,
  faMinus,
  faHandHoldingUsd,
  faBan,
  faAddressBook,
  faUndo,
  faMoneyBill,
  faCreditCard,
  faCoins,
  faCcVisa,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faLongArrowAltDown,
  faCheck,
  faGripLines,
  faEnvelope,
  faPhone,
  faMapMarkedAlt,
  faGlobeAmericas,
  faBirthdayCake,
  faCity,
  faTag
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
