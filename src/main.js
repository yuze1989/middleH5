import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import weChat from './utils/wechat';
import Env from './utils/deviceinfo';
import './assets/iconfont/iconfont.css';

Vue.config.productionTip = false;
const env = Env.getType();
if (env.platformType === 'WX_GZ') {
  weChat.setWxConfig();
}
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
