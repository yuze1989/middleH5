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
    },
  },
  {
    path: '/material',
    name: 'material',
    meta: {
      tabbarshow: true,
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
    const userId = localStorage.getItem('userId');
    if (!userId && !options.code) {
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
