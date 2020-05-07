import { get, post, put } from '@/utils/send';
import { ResponseType } from './common';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export interface Menu {
  title: string;
  icon: string;
  key?: string;
  children?: Menu[];
}

export interface UserInfoType extends ResponseType {
  data: {
    username: string;
    createTime: number;
    permission: number;
    menu: Menu[];
  };
}

export const login = (params: LoginParamsType): Promise<UserInfoType> => {
  return post('/login', params);
};

export const logout = () => {
  return get('/logout', {});
};

export const updateBasicInfo = (params: any) => {
  return put('/update_basic_info', params);
};

export const check = (params: any) => {
  return put('/check', params);
};

export const getFakeCaptcha = (mobile: string) => {
  return get(`/api/captcha?mobile=${mobile}`, {});
};
