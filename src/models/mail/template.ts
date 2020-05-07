import { message } from 'antd';
import intl from 'react-intl-universal';
import {
  delMailTemplate,
  getMailTemplateList,
  MailTemplateItem,
  MailTemplateType,
  editMailTemplate,
  createMailTemplate,
} from '@/services/mail/template';
import { Model } from 'dva';
import { Pagination, BusinessData } from '@/models/common';
import { getMailBusinessList, MailBusinessType } from '@/services/mail/business';

export interface MailTemplateState {
  dataList: MailTemplateItem[];
  isLoading: boolean;
  confirmLoading: boolean;
  // 当isShouldRefresh为true时，list初始化是才可以进行获取数据，当跳转create页面时，需要将这个值设为false，然后返回时，才不会刷新页面
  // When isShouldRefresh is true, the listPage initializes to get the data, and when jump to the createPage, you need to set this value to false, and when you return, the page will not be refreshed
  isShouldRefresh: boolean;
  editIndex: number;
  pagination: Pagination;
  businessData: BusinessData;
}

export interface MailTemplateModel extends Model {
  state: MailTemplateState;
}

const initState: MailTemplateState = {
  dataList: [],
  isLoading: true,
  confirmLoading: false,
  isShouldRefresh: true,
  editIndex: -1,
  pagination: { defaultPageSize: 10, total: 0, current: 1 },
  businessData: {
    isLoading: false,
    isLoadedData: false,
    curIndex: 0,
    rawData: [],
  },
};

const model: MailTemplateModel = {
  namespace: 'mailTemplate',
  state: JSON.parse(JSON.stringify(initState)),
  reducers: {
    change(state, { payload }: any) {
      return { ...state, ...payload };
    },
    reset(state) {
      const syncSate = JSON.parse(JSON.stringify(initState));
      delete syncSate.businessData;
      return { ...state, ...syncSate };
    },
  },
  effects: {
    *createTemplate({ payload }, { put, select }) {
      yield put({
        type: 'change',
        payload: { confirmLoading: true },
      });
      const { editIndex, dataList }: MailTemplateState = yield select((state: { mailTemplate: MailTemplateState }) => state.mailTemplate);
      let result: MailTemplateType;
      if (editIndex !== -1) {
        payload.id = dataList[editIndex].id;
        result = yield editMailTemplate(payload);
      } else {
        result = yield createMailTemplate(payload);
      }
      if (result && result.code === 0) {
        message.success(editIndex !== -1 ? intl.get('sms.tpl.edit.success') : intl.get('sms.tpl.create.success'));
        history.back();
        yield put({
          type: 'getTemplateList',
        });
      }
      yield put({
        type: 'change',
        payload: {
          editIndex: -1,
          confirmLoading: false,
        },
      });
    },
    *deleteTemplate({ payload }, { put }) {
      const result = yield delMailTemplate({ id: payload.id });
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
      const templateState: MailTemplateState = yield select((state: { mailTemplate: MailTemplateState }) => state.mailTemplate);
      const { current } = templateState.pagination;
      const result: MailTemplateType = yield getMailTemplateList({ pageNo: current, name, kind });
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
    *getBusinessData(_, { put, select }) {
      const { businessData, editIndex, dataList }: MailTemplateState = yield select(
        (state: { mailTemplate: MailTemplateState }) => state.mailTemplate
      );
      yield put({
        type: 'change',
        payload: { businessData: { ...businessData, isLoading: true } },
      });
      const result: MailBusinessType = yield getMailBusinessList();
      if (result && result.code === 0 && result.data) {
        const list = result.data.list || [];
        list.forEach((item) => {
          const { buKind, buId, buSystem } = item;
          const index = businessData.rawData.findIndex((e) => e.buKind === buKind);
          if (index === -1) {
            businessData.rawData.push({ buKind, buId, children: [buSystem] });
          } else {
            businessData.rawData[index].children.push(buSystem);
          }
        });
        if (editIndex !== -1) {
          businessData.curIndex = businessData.rawData.findIndex((raw) => raw.buKind === dataList[editIndex].buKind);
        }
        businessData.isLoadedData = true;
      }
      businessData.isLoading = false;
      yield put({
        type: 'change',
        payload: { businessData: { ...businessData } },
      });
    },
  },
};

export default model;
