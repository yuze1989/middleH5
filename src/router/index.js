import Vue from 'vue';
import VueRouter from 'vue-router';
import { Toast } from 'vant';
import qs from 'qs';
import Http from '@/utils/http';
import Env from '@/utils/deviceinfo';
import Util from '@/utils/util';
import Config from '@/utils/config';
import speechArt from '@/views/speechArt.vue';

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
    component: () => import(/* webpackChunkName: "material" */'../views/material.vue'),
  },
  {
    path: '/details',
    name: 'details',
    meta: {
      tabbarshow: false,
    },
    component: () => import(/* webpackChunkName: "material" */'../views/details.vue'),
  },
  {
    path: '/workbench',
    name: 'workbench',
    meta: {
      showTabbar: true,
    },
    component: () => import('../views/workbench/index.vue'),
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      showTabbar: true,
    },
    component: () => import(/* webpackChunkName: "workbench" */'../views/customer.vue'),
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      showTabbar: true,
    },
    component: () => import(/* webpackChunkName: "workbench" */'../views/my.vue'),
  },
  {
    path: '/marketing',
    name: 'marketing',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "marketing" */'../views/marketing.vue'),
  },
  {
    path: '/surplus',
    name: 'surplus',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "surplus" */'../views/surplus.vue'),
  },
  {
    path: '/workDetails',
    name: 'workDetails',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "workDetails" */'../views/workDetails/index.vue'),
  },
  {
    path: '/portraitDetails',
    name: 'portraitDetails',
    meta: {
      tabbarshow: false,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "portraitDetails" */'../views/portraitDetails.vue'),
  },
  {
    path: '/radar',
    name: 'radar',
    meta: {
      tabbarshow: false,
      type: 1,
    },
    component: () => import(/* webpackChunkName: "about" */'../views/radar.vue'),
  },
  {
    path: '/daily-summary',
    name: 'dailySummary',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "dailySummary" */'../views/DailySummary/dailySummary.vue'),
  },
  {
    path: '/customer-thread',
    name: 'customerThread',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "customerThread" */'../views/customerThread/index.vue'),
  },
  {
    path: '/thread-record/:taskResultId',
    name: 'threadRecord',
    meta: {
      tabbarshow: true,
      type: 2,
    },
    component: () => import(/* webpackChunkName: "threadRecord" */'../views/customerThread/record.vue'),
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
    // ????????????????????????????????????
    const generalidArr = ['channel', 'appid', 'batchNo', 'checkpc'];
    // appid?????????, ???????????????appid??????????????????????????????????????????
    if (options.appid && options.appid !== corpId) {
      localStorage.clear();
    }
    // localStorage.setItem('openId', 'oNmRcv1pONjYYQ8VVy2OPc-X5_l0');
    // sessionStorage.setItem(
    //   'token',
    // eslint-disable-next-line max-len
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTcwIn0.oooPX8zq3c3jr2ic5wwqyexf7LOCP9loIzJnsOPn8R0',
    // );
    let openid = localStorage.getItem('openId');
    if (openid === 'null') {
      // ????????????????????????????????????null??????????????????
      localStorage.clear();
      openid = '';
    }
    const agentId = localStorage.getItem('agentId');
    if (!agentId) {
      sessionStorage.removeItem('token');
    }
    let token = sessionStorage.getItem('token');
    if (!openid && !options.appid && !options.code) {
      Toast('appid??????');
      return;
    }
    const dataList = {};
    // ???????????????????????????????????????????????????dataList???????????????????????????????????????
    generalidArr.forEach((item) => {
      if (options[item]) {
        dataList[item] = options[item];
      }
    });
    if (!openid && options.appid && !options.code) {
      const sourceId = options.channel || '';
      const scopeType = options.channel === '0' ? 'snsapi_privateinfo' : 'snsapi_userinfo';
      const wxAppId = options.channel === '0' ? Config.globalOpt.appId : options.appid;
      const redirectuUrl = options.channel === '0'
        ? Config.redirect_uri
        : `${Config.state_url}${src}?${qs.stringify(dataList)}`;
      const stateUrl = options.channel === '0'
        ? encodeURIComponent(`${Config.state_url}${src}?${qs.stringify(dataList)}`)
        : sourceId;

      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        wxAppId
      }&redirect_uri=${encodeURIComponent(redirectuUrl)}&response_type=code&scope=${scopeType}&state=${stateUrl}#wechat_redirect`;
      return;
    }
    // ????????????????????????????????????????????????token
    if (openid && !token) {
      const res = await Http.post('/scrm/wechat/oauth-user-info-openid', {
        channel: localStorage.getItem('channel') || options.channel,
        corpId: localStorage.getItem('corpId'),
        openId: openid,
      });
      const { success, data } = res;
      if (success && data.token) {
        token = data.token;
        sessionStorage.setItem('token', data.token);
        if (data.agentId) {
          localStorage.setItem('agentId', data.agentId);
        }
        try {
          window.dc('login', data.tenantId, data.userId);
        } catch (e) {
          console.log(e);
        }
      }
    }
    // ??????????????????????????????
    if (!token && options.code) {
      const res = await Http.post('/scrm/wechat/get-oauth-user-info', {
        corpId: options.appid,
        code: options.code,
        channel: options.channel,
      });
      const { success, data } = res;
      if (success) {
        const arr = ['unionId', 'openId', 'userId', 'agentId', 'corpId', 'tenantId'];
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
        try {
          window.dc('login', data.tenantId, data.userId);
        } catch (e) {
          console.log(e);
        }
      }
    }
    if (token) {
      if (options.checkpc && !Env.getType().isMobile) {
        window.location.href = `${Config.pcUrl}?token=${token}`;
        return;
      }
      try {
        window.dc('page', to.name);
      } catch (e) {
        console.log(e);
      }
      next();
    }
    return;
  }
  try {
    window.dc('page', to.name);
  } catch (e) {
    console.log(e);
  }
  next();
});

export default router;
