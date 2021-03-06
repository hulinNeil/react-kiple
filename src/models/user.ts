import * as api from '@/services/login';
import { Model, routerRedux } from 'dva';
import { storage, delUserStorage } from '@/utils/tools';

export interface UserState {
  loggedIn: boolean;
  isAccount: boolean;
  submitting: false;
  userInfo: {
    userName: string;
    avatar: string;
    permission: number; // 权限：1（增删改），2（查）
  };
}

export interface UserModel extends Model {
  state: UserState;
}

const model: UserModel = {
  namespace: 'user',
  state: {
    loggedIn: false,
    isAccount: true,
    submitting: false,
    userInfo: {
      userName: '',
      permission: 2,
      avatar: '',
    },
  },
  reducers: {
    change(state, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'change',
        payload: { submitting: true },
      });
      const data: api.UserInfoType = yield call(api.login, payload);
      if (data && data.code === 0) {
        const userInfo = {
          userName: data.data.username,
          permission: data.data.permission,
        };
        storage.setItem('user_key', userInfo);
        storage.setItem('menu_list', data.data.menu);
        yield put({
          type: 'change',
          payload: {
            loggedIn: true,
            submitting: false,
            userInfo,
          },
        });
        yield put(routerRedux.push('/'));
      } else {
        yield put({
          type: 'change',
          payload: { submitting: false },
        });
      }
    },
    *logout(_, { put }) {
      // yield call(api.logout);
      delUserStorage();
      yield put({
        type: 'change',
        payload: { loggedIn: false, user: null },
      });
      yield put(routerRedux.push('/login'));
    },
    getCaptcha({ payload }) {
      console.log('获取验证码', payload);
    },
    *checkStatus({ payload }, { put }) {
      // yield call(api.check);
      yield put({
        type: 'change',
        payload: { loggedIn: true, userInfo: payload.userInfo },
      });
    },
  },
};

export default model;
