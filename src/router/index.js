import Vue from 'vue';
import VueRouter from 'vue-router';
import Http from '../utils/http';
import Env from '../utils/deviceinfo';
import Util from '../utils/util';
import Config from '../utils/config';
import store from '@/store';
import speechArt from '../views/speechArt.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'speechArt',
    component: speechArt,
    meta: {
      tabbarshow: true,
      type: 1,
    },
  },
  {
    path: '/material',
    name: 'material',
    meta: {
      tabbarshow: true,
      type: 1,
      keepAlive: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */'../views/material.vue'),
  },
  {
    path: '/details',
    name: 'details',
    meta: {
      tabbarshow: false,
    },
    component: () => import('../views/details.vue'),
  },
  {
    path: '/workbench',
    name: 'workbench',
    meta: {
      tabbarshow: false,
      type: 2,
      keepAlive: true,
    },
    component: () => import('../views/workbench.vue'),
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import('../views/customer.vue'),
  },
  {
    path: '/marketing',
    name: 'marketing',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import('../views/marketing.vue'),
  },
  {
    path: '/surplus',
    name: 'surplus',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import('../views/surplus.vue'),
  },
  {
    path: '/workDetails',
    name: 'workDetails',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import('../views/workDetails.vue'),
  },
  {
    path: '/jurisdiction',
    name: 'jurisdiction',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import('../views/jurisdiction.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, form, next) => {
  if (Env.getType().platformType === 'WX_GZ') {
    const url = window.location.href;
    const options = Util.getUrlOption(url);
    // localStorage.removeItem('token');
    const token = sessionStorage.getItem('token');
    let src = window.location.pathname;
    if (!token && !options.code && options.appid) {
      if (src.charAt(src.length - 1) === '/') {
        src = src.substr(0, src.length - 1);
      }
      const sourceId = options.channel || '';
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        options.appid
      }&redirect_uri=${
        encodeURIComponent(`${Config.redirect_uri}${src}?channel=${sourceId}&appid=${options.appid}`)
      }&response_type=code&scope=snsapi_userinfo&state=${sourceId}#wechat_redirect`;
      return;
    }
    if (!token && options.code) {
      Http.post('/scrm/wechat/get-oauth-user-info', {
        corpId: options.appid,
        code: options.code,
        channel: options.channel,
      }).then((res) => {
        const { success, data } = res;
        console.log(data);
        if (success) {
          sessionStorage.setItem('unionId', data.unionid);
          sessionStorage.setItem('openid', data.openid);
          if (data.userId) {
            sessionStorage.setItem('userId', data.userId);
          }
          if (data.agentId) {
            sessionStorage.setItem('agentId', data.agentId);
          }
          if (data.corpId) {
            sessionStorage.setItem('corpId', data.corpId);
            store.dispatch('SETCORPID', data.corpId);
          }
          if (data.token) {
            sessionStorage.setItem('token', data.token);
            store.dispatch('SETTOKEN', data.token);
          }
          sessionStorage.setItem('wxInfo', JSON.stringify(res.data));
          if (options.channel) {
            sessionStorage.setItem('channel', options.channel);
          }
        }
        next();
      }).finally(() => {
        next();
      });
      return;
    }
    // return;
  }
  next();
});

export default router;
