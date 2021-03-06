import axios from 'axios';
// import Util from './util';
// import Config from './config';
import {
  Toast,
} from 'vant';

const baseURL = process.env.VUE_APP_ENV !== 'development' ? 'https://scrm.juzhunshuyu.com' : 'https://test-scrm.juzhunshuyu.com';
const instance = axios.create({
  timeout: 100000, // 请求超时时间
  baseURL,
});
// 请求拦截添加头部参数等
instance.interceptors.request.use((config) => {
  const globalOptStr = sessionStorage.getItem('globalOpt');
  const globalOpt = !globalOptStr ? {} : JSON.parse(globalOptStr);
  const configTemp = config;
  const token = sessionStorage.getItem('token');
  configTemp.headers = config.headers || {};
  Object.assign(config.headers, globalOpt);
  // mockToken
  configTemp.headers.token = token;
  return config;
}, (error) => {
  Promise.reject(error);
});

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.errCode === '0100000004') {
      sessionStorage.removeItem('token');
    }
    if (data.errCode === '0100000014') {
      Toast.fail(data.errMessage);
      return Promise.reject(data);
    }
    return data;
  },
  (error) => {
    Promise.reject(error);
  },
);

const http = {
  post(url, data, header) {
    return instance({
      url,
      data,
      headers: header,
      method: 'post',
    });
  },
  get(url, params) {
    return instance({
      url,
      params,
      method: 'get',
    });
  },
  postFormData(url, data) {
    return instance({
      url,
      data, // formData形式传入
      method: 'post',
    });
  },
};

export default http;
