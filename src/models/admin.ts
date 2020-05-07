import { storage } from '@/utils/tools';
import { Model } from 'dva';
import { Menu } from '@/services/login';

export interface AdminState {
  currentMenuIndex: number;
}

export interface AdminModel extends Model {
  state: AdminState;
}

// 后面会做修改，将菜单之类的放到这里
const model: AdminModel = {
  namespace: 'admin',
  state: {
    currentMenuIndex: -1,
  },
  reducers: {
    changePath(state, { payload }: any) {
      let menuList: Array<Menu> = [];
      const menuListLocal = storage.getItem('menu_list');
      menuListLocal &&
        menuListLocal.forEach((item: Menu) => {
          if (item.children) {
            menuList = menuList.concat(item.children);
          }
        });
      const currentMenuIndex = menuList.findIndex((item) => ~payload.path.indexOf(item.key));
      return { ...state, currentMenuIndex };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        dispatch({
          type: 'changePath',
          payload: {
            path: pathname,
          },
        });
      });
    },
  },
};

export default model;
