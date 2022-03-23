import Vue from 'vue';
import less from 'less';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/iconfont/iconfont.css';
import util from './utils/util';

Vue.use(less);

Vue.config.productionTip = false;
util.onresizeRem();
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
