import Vue from 'vue';
import App from './App.vue';
import router from './routes'; //설정 라우터 호출
import axios from 'axios'; //axios 호출


import { library as faLibrary } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faPlus,faWonSign, faAddressCard,faAlignJustify,faArrowAltCircleRight,faArrowAltCircleLeft,
       faUser,faComments,faListUl,faCog,faHeart,faEye,faClock } from '@fortawesome/free-solid-svg-icons' 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' 
// Set up FontAwesome 
faLibrary.add(faHome, faSearch, faPlus, faWonSign, 
  faAddressCard,faAlignJustify,faArrowAltCircleRight,
  faArrowAltCircleLeft,faUser,faComments,faListUl,faCog,faHeart,faEye,faClock) 
Vue.component('font-awesome-icon', FontAwesomeIcon)



Vue.prototype.$axios = axios; //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음

new Vue({
  render: h => h(App)
  ,router
}).$mount('#app')

