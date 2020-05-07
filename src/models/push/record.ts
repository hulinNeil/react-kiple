import { message } from 'antd';
import intl from 'react-intl-universal';
import { Model } from 'dva';
import { getSmsTemplateList, SmsTemplatelItem, SmsTemplateType } from '@/services/sms/template';
import { SmsCronjobItem, getSmsCronjobList, deleteSmsCronjob, createSmsCronjob, SmsCronjobType } from '@/services/sms/cronjob';
import { Pagination } from '@/models/common';

interface ThemeListType {
  current: number;
  total: number;
  themeLoading: boolean;
  curIndex: number;
  themeList: SmsTemplatelItem[];
}

export interface PushRecordState {
  dataList: SmsCronjobItem[];
  isLoading: boolean;
  confirmLoading: boolean;
  // 当isShouldRefresh为true时，list初始化是才可以进行获取数据，当跳转create页面时，需要将这个值设为false，然后返回时，才不会刷新页面
  // When isShouldRefresh is true, the listPage initializes to get the data, and when jump to the createPage, you need to set this value to false, and when you return, the page will not be refreshed
  isShouldRefresh: boolean;
  pagination: Pagination;
  themeListData: ThemeListType;
}

export interface PushRecordModel extends Model {
  state: PushRecordState;
}

const initState: PushRecordState = {
  dataList: [],
  isLoading: true,
  isShouldRefresh: true,
  confirmLoading: false,
  pagination: { defaultPageSize: 10, total: 0, current: 1 },
  themeListData: {
    current: 1,
    total: 0,
    curIndex: -1,
    themeLoading: false,
    themeList: [],
  },
};

const pushRecordModel: PushRecordModel = {
  namespace: 'pushRecord',
  state: JSON.parse(JSON.stringify(initState)),
  reducers: {
    change(state, { payload }: any) {
      console.log(payload);
      return { ...state, ...payload };
    },
    reset(state) {
      console.log('reset');
      const syncSate = JSON.parse(JSON.stringify(initState));
      delete syncSate.tempListData;
      return { ...state, ...syncSate };
    },
  },
  effects: {
    *createPush({ payload }, { put, select }) {
      yield put({
        type: 'change',
        payload: { confirmLoading: true },
      });
      const result = yield createSmsCronjob(payload);
      if (result && result.code === 0) {
        message.success(intl.get('sms.send.crete.cuccess'));
        yield put({
          type: 'getCronjobList',
        });
      }
      const { themeListData }: PushRecordState = yield select((state: { pushRecord: PushRecordState }) => state.pushRecord);
      yield put({
        type: 'change',
        payload: {
          dialogVisible: false,
          confirmLoading: false,
          themeListData: { ...themeListData, curIndex: -1 },
        },
      });
    },
    *deletePush({ payload }, { put }) {
      const result = yield deleteSmsCronjob({ id: payload.id });
      if (result && result.code === 0) {
        message.success(intl.get('sms.send.delete.success'));
        yield put({
          type: 'getCronjobList',
        });
      }
    },
    *getPushList(_, { put, select }) {
      const smsCronjobState: PushRecordState = yield select((state: { pushRecord: PushRecordState }) => state.pushRecord);
      yield put({
        type: 'change',
        payload: { isLoading: true },
      });
      const result: SmsCronjobType = yield getSmsCronjobList({ pageNo: smsCronjobState.pagination.current });
      if (result && result.code === 0 && result.data) {
        smsCronjobState.dataList = result.data.list || [];
        smsCronjobState.pagination.total = result.data.totalCount;
      }
      smsCronjobState.isLoading = false;
      yield put({
        type: 'change',
        payload: { ...smsCronjobState },
      });
    },
    *getThemeList(_, { put, select }) {
      const { themeListData }: PushRecordState = yield select((state: { pushRecord: PushRecordState }) => state.pushRecord);
      yield put({
        type: 'change',
        payload: { themeListData: { ...themeListData, tempLoading: true } },
      });

      const { current } = themeListData;
      const result: SmsTemplateType = yield getSmsTemplateList({ pageNo: current, name: '', kind: 0 });
      if (result && result.code === 0 && result.data && result.data.list) {
        themeListData.themeList.push(...result.data.list);
        themeListData.total = result.data.totalCount;
        themeListData.current += 1;
      }
      themeListData.themeLoading = false;
      yield put({
        type: 'change',
        payload: { themeListData: { ...themeListData } },
      });
    },
  },
};

export default pushRecordModel;
