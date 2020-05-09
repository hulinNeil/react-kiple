import { message } from 'antd';
import intl from 'react-intl-universal';
import { Model } from 'dva';
import { getSmsTemplateList, SmsTemplatelItem, SmsTemplateType } from '@/services/sms/template';
import { SmsCronjobItem, getSmsCronjobList, deleteSmsCronjob, createSmsCronjob, SmsCronjobType } from '@/services/sms/cronjob';
import { Pagination } from '@/models/common';

interface TempListDataType {
  current: number;
  total: number;
  tempLoading: boolean;
  curIndex: number;
  tempList: SmsTemplatelItem[];
}

export interface SmsCronjobState {
  dataList: SmsCronjobItem[];
  isLoading: boolean;
  dialogVisible: boolean;
  confirmLoading: boolean;
  pagination: Pagination;
  tempListData: TempListDataType;
}

export interface SmsCronjobModel extends Model {
  state: SmsCronjobState;
}

const initState: SmsCronjobState = {
  dataList: [],
  isLoading: true,
  dialogVisible: false,
  confirmLoading: false,
  pagination: { defaultPageSize: 10, total: 0, current: 1 },
  tempListData: {
    current: 1,
    total: 0,
    curIndex: -1,
    tempLoading: false,
    tempList: [],
  },
};

const smsCronjobModel: SmsCronjobModel = {
  namespace: 'smsCronjob',
  state: JSON.parse(JSON.stringify(initState)),
  reducers: {
    change(state, { payload }: any) {
      return { ...state, ...payload };
    },
    reset(state) {
      const syncSate = JSON.parse(JSON.stringify(initState));
      delete syncSate.tempListData;
      return { ...state, ...syncSate };
    },
  },
  effects: {
    *createCronjob({ payload }, { put, select }) {
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
      const { tempListData }: SmsCronjobState = yield select((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob);
      yield put({
        type: 'change',
        payload: {
          dialogVisible: false,
          confirmLoading: false,
          tempListData: { ...tempListData, curIndex: -1 },
        },
      });
    },
    *deleteCronjob({ payload }, { put }) {
      const result = yield deleteSmsCronjob({ id: payload.id });
      if (result && result.code === 0) {
        message.success(intl.get('sms.send.delete.success'));
        yield put({
          type: 'getCronjobList',
        });
      }
    },
    *getCronjobList(_, { put, select }) {
      const smsCronjobState: SmsCronjobState = yield select((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob);
      yield put({
        type: 'change',
        payload: { isLoading: true },
      });
      const result: SmsCronjobType = yield getSmsCronjobList({ pageno: smsCronjobState.pagination.current });
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
    *getTemplateList(_, { put, select }) {
      const { tempListData }: SmsCronjobState = yield select((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob);
      yield put({
        type: 'change',
        payload: { tempListData: { ...tempListData, tempLoading: true } },
      });

      const { current } = tempListData;
      const result: SmsTemplateType = yield getSmsTemplateList({ pageno: current, name: '', kind: 0 });
      if (result && result.code === 0 && result.data && result.data.list) {
        tempListData.tempList.push(...result.data.list);
        tempListData.total = result.data.totalCount;
        tempListData.current += 1;
      }
      tempListData.tempLoading = false;
      yield put({
        type: 'change',
        payload: { tempListData: { ...tempListData } },
      });
    },
  },
};

export default smsCronjobModel;
