import Vue from 'vue';
import VueRouter from 'vue-router';
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
    // localStorage.removeItem('userId');
    let userId = localStorage.getItem('userId');
    if (!options.code) {
      options.code = false;
    }
    if (userId === null || !userId) {
      userId = false;
    }
    alert(userId);
    alert(options.code);
    if (!userId && !options.code) {
      alert(1);
      const sourceId = options.channel || '';
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        Config.corpId
      }&redirect_uri=${
        encodeURIComponent('https://test-scrm.juzhunshuyu.com/middleH5/')
      }&response_type=code&scope=snsapi_userinfo&state=${sourceId}#wechat_redirect`;
      return;
    }

    if (!userId && options.code) {
      Http.post('/scrm/wechat/get-oauth-user-info', {
        corpId: Config.corpId,
        code: options.code,
        officialId: 4,
      }).then((res) => {
        const { success, data } = res;
        if (success) {
          localStorage.setItem('unionId', data.unionid);
          localStorage.setItem('openid', data.openid);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('token', data.token);
          localStorage.setItem('wxInfo', JSON.stringify(res.data));
        }
        next();
      }).finally(() => {
        next();
      });
    }
  }
  next();
});

export default router;
