import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { storage, delUserStorage } from './tools';
import { apiConfig } from '@/config/index';

function checkLoginAndSetToken(resp: AxiosResponse): boolean {
  const token = resp.headers.authorization;
  const expireTime = resp.headers.expire_time;
  const code = resp.data.code;
  if (code === 401) {
    delUserStorage();
    message.error(resp.data.message, 1000);
    setTimeout(function () {
      window.location.href = '/';
    }, 500);
    return false;
  }
  if (token) {
    const tokenArr = token.split(' ');
    storage.setItem('request_token', tokenArr[1]);
    storage.setItem('expire_time', Number(expireTime));
  }
  return true;
}

axios.interceptors.request.use(function (config) {
  config.url = apiConfig.host + apiConfig.proxy + config.url;
  const requestToken = storage.getItem('request_token');
  config.headers['Authorization'] = 'Bearer ' + requestToken;
  config.headers.post['Content-Type'] = 'application/json';
  config.timeout = 60000;
  return config;
});
axios.interceptors.response.use(
  function (response) {
    if (checkLoginAndSetToken(response) === false) {
      return Promise.reject(false);
    }
    // 统一处理服务端返回的错误(Uniformly handles errors returned by the server)
    if (response && response.data && response.data.code !== 0 && response.data.msg) {
      message.error(response.data.msg);
    }
    return response;
  },
  function (error) {
    console.log(error);
    message.error('未知错误，请检查下你的网络哦~');
    return error;
  }
);

export const post = (url: string, param: any) => {
  const CancelToken = axios.CancelToken; // axios cancel request
  const source = CancelToken.source();
  post.prototype.source = source;
  return axios.post(url, param, { cancelToken: source.token }).then((resp) => resp.data);
};

export const put = (url: string, param: any) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  put.prototype.source = source;
  return axios.put(url, param).then((resp) => resp.data);
};

export const get = (url: string, params: any) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  get.prototype.source = source;
  return axios.get(url, { params }).then((resp) => resp.data);
};

export const del = (url: string, params: any) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  del.prototype.source = source;
  return axios.delete(url, { params }).then((resp) => resp.data);
};

export const download = (url: string, params: any) => {
  return axios({
    method: 'get',
    url: url,
    params: params,
    headers: {
      'Content-Type': 'application/json;application/octet-stream',
    },
    responseType: 'blob',
  }).then((resp) => {
    return {
      data: resp.data,
    };
  });
};
