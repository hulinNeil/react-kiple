import * as api from '@/services/login';
import { Model, routerRedux } from 'dva';
import { storage, delUserStorage } from '@/utils/tools';

export interface UserState {
  loggedIn: boolean;
  submitting: false;
  remember: boolean;
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
    submitting: false,
    remember: true,
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
    *login({ payload }, { call, put, select }) {
      yield put({
        type: 'change',
        payload: { submitting: true },
      });
      const data: api.UserInfoType = yield call(api.login, payload);
      if (data && data.code === 0) {
        const remember = yield select((state: { user: UserState }) => state.user.remember);
        const userInfo = {
          userName: data.data.username,
          permission: data.data.permission,
        };
        if (remember) {
          storage.setItem('user_key', userInfo);
        }
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
