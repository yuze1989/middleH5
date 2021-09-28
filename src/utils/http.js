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
  configTemp.headers.token = token;// 'mockToken'
  return config;
}, (error) => {
  Promise.reject(error);
});

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    switch (data.errCode) {
      case '0100000005':
        window.location.href = 'https://test-scrm.juzhunshuyu.com/middleH5/jurisdiction?msg=您没有访问权限，请联系您所在企业的管理员';
        break;
      case '0100000006':
        window.location.href = 'https://test-scrm.juzhunshuyu.com/middleH5/jurisdiction?msg=您没有访问权限，请联系您所在企业的管理员；';
        break;
      case '0100000007':
        window.location.href = 'https://test-scrm.juzhunshuyu.com/middleH5/jurisdiction?msg=您没有访问权限，请联系您所在企业的管理员；';
        break;
      default:
        return data;
    }
    return data;
  },
  // (response) => (response.data),
  (error) => {
    window.location.href = 'https://test-scrm.juzhunshuyu.com/middleH5/jurisdiction?msg=请检查网络情况后再尝试访问；';
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
