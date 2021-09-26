import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://test-scrm.juzhunshuyu.com' : '';
const instance = axios.create({
  // baseURL: 'https://test-scrm.juzhunshuyu.com',
  timeout: 100000, // 请求超时时间
  baseURL,
});

// 请求拦截添加头部参数等
instance.interceptors.request.use((config) => {
  const globalOptStr = sessionStorage.getItem('globalOpt');
  const globalOpt = !globalOptStr ? {} : JSON.parse(globalOptStr);
  const configTemp = config;
  const token = localStorage.getItem('token');
  configTemp.headers = config.headers || {};
  Object.assign(config.headers, globalOpt);
  configTemp.headers.token = token || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzEifQ.PsAIvzFtOj-zYXCpc4u8IFnY8a5yFH0HQGOmJawW1N8';
  return config;
}, (error) => {
  Promise.reject(error);
});

// 响应拦截
instance.interceptors.response.use(
  (response) => (response.data),
  (error) => (Promise.reject(error)),
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
