import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/iconfont/iconfont.css';
import util from './utils/util';

Vue.config.productionTip = false;
util.onresizeRem();
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
