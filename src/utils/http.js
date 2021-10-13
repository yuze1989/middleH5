import axios from 'axios';
// import Util from './util';
// import Config from './config';

// const baseURL = process.env.NODE_ENV === 'production' ? 'https://scrm.juzhunshuyu.com' : 'https://test-scrm.juzhunshuyu.com';
const baseURL = process.env.NODE_ENV === 'production' ? 'https://test-scrm.juzhunshuyu.com' : 'https://test-scrm.juzhunshuyu.com';
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
  configTemp.headers.token = token || 'mockToken';
  return config;
}, (error) => {
  Promise.reject(error);
});

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    // Util.go(data.errCode);
    // if (errorList[data.errCode]) {
    //   window.location.href = `${Config.redirect_uri}/middleH5/jurisdiction?msg=
    //   ${errorList[data.errCode][0]}&type=${errorList[data.errCode][1]}`;
    // }
    return data;
  },
  // (response) => (response.data),
  (error) => {
    // if (errorList.errCode) {
    //   window.location.href = `${Config.redirect_uri}/middleH5/jurisdiction?msg=
    //   ${errorList.errCode[0]}&type=${errorList.errCode[1]}`;
    // }
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
