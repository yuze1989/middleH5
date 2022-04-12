import Vue from 'vue';
import { Dialog } from 'vant';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/iconfont/iconfont.css';
import util from './utils/util';

Vue.use(Dialog);
Vue.use(VueClipboard);

Vue.config.productionTip = false;
util.onresizeRem();
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
