import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store/store';
import './registerServiceWorker';
import * as dotenv from 'dotenv';
dotenv.config();

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
