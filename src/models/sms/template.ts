import { message } from 'antd';
import intl from 'react-intl-universal';
import { getSmsTemplateList, SmsTemplatelItem, SmsTemplateType, delSmsTemplate, editSmsTemplate, createSmsTemplate } from '@/services/sms/template';
import { Model } from 'dva';
import { Pagination } from '@/models/common';

export interface SmsTemplateState {
  dataList: SmsTemplatelItem[];
  isLoading: boolean;
  dialogVisible: boolean;
  confirmLoading: boolean;
  editIndex: number;
  pagination: Pagination;
}

export interface SmsTemplateModel extends Model {
  state: SmsTemplateState;
}

const initState: SmsTemplateState = {
  dataList: [],
  isLoading: true,
  dialogVisible: false,
  confirmLoading: false,
  editIndex: -1,
  pagination: { defaultPageSize: 10, total: 0, current: 1 },
};

const model: SmsTemplateModel = {
  namespace: 'smsTemplate',
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
    *createTemplate({ payload }, { put, select }) {
      yield put({
        type: 'change',
        payload: { confirmLoading: true },
      });
      const { editIndex, dataList }: SmsTemplateState = yield select((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate);
      let result: SmsTemplateType;
      if (editIndex !== -1) {
        payload.id = dataList[editIndex].id;
        result = yield editSmsTemplate(payload);
      } else {
        result = yield createSmsTemplate(payload);
      }
      if (result && result.code === 0) {
        message.success(editIndex !== -1 ? intl.get('sms.tpl.edit.success') : intl.get('sms.tpl.create.success'));
        yield put({
          type: 'getTemplateList',
        });
      }
      yield put({
        type: 'change',
        payload: {
          dialogVisible: false,
          editIndex: -1,
          confirmLoading: false,
        },
      });
    },
    *deleteTemplate({ payload }, { put }) {
      const result = yield delSmsTemplate({ id: payload.id });
      if (result && result.code === 0) {
        message.success(intl.get('sms.tpl.delete.success'));
        yield put({
          type: 'getTemplateList',
        });
      }
    },
    *getTemplateList({ payload }, { put, select }) {
      yield put({
        type: 'change',
        payload: { isLoading: true },
      });
      const name = payload && payload.name ? payload.name : '';
      const kind = payload && payload.kind ? payload.kind : 0;
      const templateState: SmsTemplateState = yield select((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate);
      const { current } = templateState.pagination;
      const result: SmsTemplateType = yield getSmsTemplateList({ pageno: current, name, kind });
      if (result && result.code === 0 && result.data) {
        templateState.dataList = result.data.list || [];
        templateState.pagination.total = result.data.totalCount;
      }
      templateState.isLoading = false;
      yield put({
        type: 'change',
        payload: { ...templateState },
      });
    },
  },
};

export default model;
