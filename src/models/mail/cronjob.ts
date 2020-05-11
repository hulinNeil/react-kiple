import { message } from 'antd';
import intl from 'react-intl-universal';
import { Model } from 'dva';
import { getMailTemplateList, MailTemplateItem, MailTemplateType } from '@/services/mail/template';
import { MailCronjobItem, getMailCronjobList, deleteMailCronjob, createMailCronjob, MailCronjobType } from '@/services/mail/cronjob';
import { Pagination } from '@/models/common';

interface TempListDataType {
  current: number;
  total: number;
  tempLoading: boolean;
  curIndex: number;
  tempList: MailTemplateItem[];
}

export interface MailCronjobState {
  dataList: MailCronjobItem[];
  isLoading: boolean;
  dialogVisible: boolean;
  confirmLoading: boolean;
  pagination: Pagination;
  tempListData: TempListDataType;
}

export interface MailCronjobModel extends Model {
  state: MailCronjobState;
}

const initState: MailCronjobState = {
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

const mailCronjobModel: MailCronjobModel = {
  namespace: 'mailCronjob',
  state: JSON.parse(JSON.stringify(initState)),
  reducers: {
    change(state, { payload }: any) {
      return { ...state, ...payload };
    },
    reset() {
      const syncSate = JSON.parse(JSON.stringify(initState));
      return { ...syncSate };
    },
  },
  effects: {
    *createCronjob({ payload }, { put, select }) {
      yield put({
        type: 'change',
        payload: { confirmLoading: true },
      });
      const result = yield createMailCronjob(payload);
      if (result && result.code === 0) {
        message.success(intl.get('sms.send.crete.cuccess'));
        yield put({
          type: 'getCronjobList',
        });
      }
      const { tempListData }: MailCronjobState = yield select((state: { mailCronjob: MailCronjobState }) => state.mailCronjob);
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
      const result = yield deleteMailCronjob({ id: payload.id });
      if (result && result.code === 0) {
        message.success(intl.get('sms.send.delete.success'));
        yield put({
          type: 'getCronjobList',
        });
      }
    },
    *getCronjobList(_, { put, select }) {
      const mailCronjobState: MailCronjobState = yield select((state: { mailCronjob: MailCronjobState }) => state.mailCronjob);
      yield put({
        type: 'change',
        payload: { isLoading: true },
      });
      const result: MailCronjobType = yield getMailCronjobList({ pageno: mailCronjobState.pagination.current });
      if (result && result.code === 0 && result.data) {
        mailCronjobState.dataList = result.data.list || [];
        mailCronjobState.pagination.total = result.data.totalCount;
      }
      mailCronjobState.isLoading = false;
      yield put({
        type: 'change',
        payload: { ...mailCronjobState },
      });
    },
    *getTemplateList(_, { put, select }) {
      const { tempListData }: MailCronjobState = yield select((state: { mailCronjob: MailCronjobState }) => state.mailCronjob);
      yield put({
        type: 'change',
        payload: { tempListData: { ...tempListData, tempLoading: true } },
      });

      const { current } = tempListData;
      const result: MailTemplateType = yield getMailTemplateList({ pageno: current, name: '', kind: 0 });
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

export default mailCronjobModel;
