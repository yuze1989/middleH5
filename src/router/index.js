import Vue from 'vue';
import VueRouter from 'vue-router';
import { Toast } from 'vant';
import qs from 'qs';
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
    component: () => import(/* webpackChunkName: "about" */'../views/details.vue'),
  },
  {
    path: '/workbench',
    name: 'workbench',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/workbench.vue'),
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/customer.vue'),
  },
  {
    path: '/marketing',
    name: 'marketing',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/marketing.vue'),
  },
  {
    path: '/surplus',
    name: 'surplus',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/surplus.vue'),
  },
  {
    path: '/workDetails',
    name: 'workDetails',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/workDetails.vue'),
  },
  {
    path: '/portraitDetails',
    name: 'portraitDetails',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/portraitDetails.vue'),
  },
  {
    path: '/radar',
    name: 'radar',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/radar.vue'),
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
    // 用于判断地址带进来的参数
    const generalidArr = ['channel', 'appid', 'batchNo'];
    // appid是唯一, 如果存储的appid和地址带进来的不同则清除缓存
    if (options.appid && options.appid !== corpId) {
      localStorage.clear();
    }
    localStorage.setItem('openId', 'oNmRcv1pONjYYQ8VVy2OPc-X5_l0');
    sessionStorage.setItem(
      'token',
      // eslint-disable-next-line max-len
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTcwIn0.oooPX8zq3c3jr2ic5wwqyexf7LOCP9loIzJnsOPn8R0',
    );
    let openid = localStorage.getItem('openId');
    if (openid === 'null') {
      // 接口有可能会返出字符串的null所以做个判断
      localStorage.clear();
      openid = '';
    }
    let token = sessionStorage.getItem('token');
    if (!openid && !options.appid && !options.code) {
      Toast('appid为空');
      return;
    }
    const dataList = {};
    // 判断地址带进来的参数如果有值则添加dataList里面用于授权完以后带的参数
    generalidArr.forEach((item) => {
      if (options[item]) {
        dataList[item] = options[item];
      }
    });
    if (!openid && options.appid && !options.code) {
      const sourceId = options.channel || '';
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        options.appid
      }&redirect_uri=${
        encodeURIComponent(`${Config.redirect_uri}${src}?${qs.stringify(dataList)}`)
      }&response_type=code&scope=snsapi_userinfo&state=${sourceId}#wechat_redirect`;
      return;
    }
    // 同一个企业不用继续授权重新拿一下token
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
    // 第一次进来拿用户数据
    if (!token && options.code) {
      const res = await Http.post('/scrm/wechat/get-oauth-user-info', {
        corpId: options.appid,
        code: options.code,
        channel: options.channel,
      });
      const { success, data } = res;
      if (success) {
        const arr = ['unionId', 'openId', 'userId', 'agentId', 'corpId'];
        arr.forEach((item) => {
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
