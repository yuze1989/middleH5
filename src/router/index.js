import Vue from 'vue';
import VueRouter from 'vue-router';
import { Toast } from 'vant';
import Http from '../utils/http';
import Env from '../utils/deviceinfo';
import Util from '../utils/util';
import Config from '../utils/config';
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
    path: '/portraitDetails',
    name: 'portraitDetails',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import('../views/portraitDetails.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, form, next) => {
  if (Env.getType().platformType === 'WX_GZ') {
    const url = window.location.href;
    const options = Util.getUrlOption(url);
    const corpId = localStorage.getItem('corpId');
    const src = window.location.pathname;
    if (options.appid !== corpId && options.appid) {
      localStorage.clear();
    }
    const openid = localStorage.getItem('openid');
    let token = sessionStorage.getItem('token');
    if (!openid && !options.appid && !options.code) {
      Toast('appid为空');
      return;
    }
    if (!openid && options.appid && !options.code) {
      const sourceId = options.channel || '';
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        options.appid
      }&redirect_uri=${
        encodeURIComponent(`${Config.redirect_uri}${src}?channel=${sourceId}&appid=${options.appid}&batchNo=${options.batchNo || ''}`)
      }&response_type=code&scope=snsapi_userinfo&state=${sourceId}#wechat_redirect`;
      return;
    }
    if (openid && !token) {
      const res = await Http.post('/scrm/wechat/oauth-user-info-openid', {
        channel: localStorage.getItem('channel'),
        corpId: localStorage.getItem('corpId'),
        openId: openid,
      });
      const { success, data } = res;
      if (success && data.token) {
        token = data.token;
        sessionStorage.setItem('token', data.token);
      }
    }
    if (!token && options.code) {
      const res = await Http.post('/scrm/wechat/get-oauth-user-info', {
        corpId: options.appid,
        code: options.code,
        channel: options.channel,
      });
      const { success, data } = res;
      if (success) {
        localStorage.setItem('unionId', data.unionid);
        const opts = ['openid', 'userId', 'agentId', 'corpId'];
        opts.forEach((item) => {
          if (data[item]) {
            localStorage.setItem(item, data[item]);
          }
        });
        if (data.token) {
          token = data.token;
          sessionStorage.setItem('token', data.token);
        }
        localStorage.setItem('wxInfo', JSON.stringify(res.data));
        if (options.channel) {
          localStorage.setItem('channel', options.channel);
        }
      }
    }
    if (token) next();
    return;
  }
  next();
});

export default router;
