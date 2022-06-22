// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import { sync } from 'vuex-router-sync'
import 'iview/dist/styles/iview.css'
import store from '@/store/store'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueSocketio from 'vue-socket.io';

import VueI18n from 'vue-i18n' 
import {messages} from './vue-bootstrap-calendar';
import shaka  from "shaka-player/dist/shaka-player.compiled.js";
import locale from 'iview/dist/locale/en-US';

Notification.requestPermission(function (permission) {

  // Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
  if(!('permission' in Notification)) {
  Notification.permission = permission;
  }
  
  });
  

Vue.use(VueSocketio, 'http://52.50.26.211:3000');
Vue.use(VueYouTubeEmbed)
Vue.use(shaka);
Vue.use(VueI18n);
window.i18n = new VueI18n({
  locale: 'en',
  messages
});
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCe92gr43sp4saSVSes4G7xJtH67b41EoY',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})
Vue.config.productionTip = false
Vue.use(iView, { locale: locale })

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  i18n
})
require('./assets/css/bot.css')
require('./assets/css/soundwave.css')
