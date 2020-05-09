import { message } from 'antd';
import intl from 'react-intl-universal';
import { Model } from 'dva';
import { Pagination } from '@/models/common';
import { createPushCronjob, deletePushCronjob, getPushCronjobList, PushCronjobItem, PushCronjobType } from '@/services/push/cronjob';
import { getPushTopicList, PushTopicType, PushTopicItem } from '@/services/push/topic';

interface TopicListData {
  current: number;
  total: number;
  topicLoading: boolean;
  topicList: PushTopicItem[];
}

export interface PushCronjobState {
  dataList: PushCronjobItem[];
  isLoading: boolean;
  confirmLoading: boolean;
  // 当isShouldRefresh为true时，list初始化是才可以进行获取数据，当跳转create页面时，需要将这个值设为false，然后返回时，才不会刷新页面
  // When isShouldRefresh is true, the listPage initializes to get the data, and when jump to the createPage, you need to set this value to false, and when you return, the page will not be refreshed
  isShouldRefresh: boolean;
  pagination: Pagination;
  topicListData: TopicListData;
}

export interface PushCronjobModel extends Model {
  state: PushCronjobState;
}

const initState: PushCronjobState = {
  dataList: [],
  isLoading: true,
  isShouldRefresh: true,
  confirmLoading: false,
  pagination: { defaultPageSize: 10, total: 0, current: 1 },
  topicListData: {
    current: 1,
    total: 0,
    topicLoading: false,
    topicList: [],
  },
};

const pushCronjobModel: PushCronjobModel = {
  namespace: 'pushCronjob',
  state: JSON.parse(JSON.stringify(initState)),
  reducers: {
    change(state, { payload }: any) {
      console.log(payload);
      return { ...state, ...payload };
    },
    reset(state) {
      const syncSate = JSON.parse(JSON.stringify(initState));
      delete syncSate.topicListData;
      return { ...state, ...syncSate };
    },
  },
  effects: {
    *createCronjob({ payload }, { put }) {
      yield put({
        type: 'change',
        payload: { confirmLoading: true },
      });
      const result = yield createPushCronjob(payload);
      if (result && result.code === 0) {
        message.success(intl.get('push.msg.success'));
        history.back();
        yield put({
          type: 'getCronjobList',
        });
      }
      yield put({
        type: 'change',
        payload: {
          isShouldRefresh: true,
          confirmLoading: false,
        },
      });
    },
    *deleteCronjob({ payload }, { put }) {
      const result = yield deletePushCronjob({ id: payload.id });
      if (result && result.code === 0) {
        message.success(intl.get('push.msg.delete.success'));
        yield put({
          type: 'getCronjobList',
        });
      }
    },
    *getCronjobList(_, { put, select }) {
      const pushCronjobState: PushCronjobState = yield select((state: { pushCronjob: PushCronjobState }) => state.pushCronjob);
      yield put({
        type: 'change',
        payload: { isLoading: true },
      });
      const result: PushCronjobType = yield getPushCronjobList({ pageno: pushCronjobState.pagination.current });
      if (result && result.code === 0 && result.data) {
        pushCronjobState.dataList = result.data.list || [];
        pushCronjobState.pagination.total = result.data.totalCount;
      }
      pushCronjobState.isLoading = false;
      yield put({
        type: 'change',
        payload: { ...pushCronjobState },
      });
    },
    *getTopicList(_, { put, select }) {
      const { topicListData }: PushCronjobState = yield select((state: { pushCronjob: PushCronjobState }) => state.pushCronjob);
      yield put({
        type: 'change',
        payload: { topicListData: { ...topicListData, topicLoading: true } },
      });

      const { current } = topicListData;
      const result: PushTopicType = yield getPushTopicList({ pageno: current });
      if (result && result.code === 0 && result.data && result.data.list) {
        topicListData.topicList.push(...result.data.list);
        topicListData.total = result.data.totalCount;
        topicListData.current += 1;
      }
      topicListData.topicLoading = false;
      yield put({
        type: 'change',
        payload: { topicListData: { ...topicListData } },
      });
    },
  },
};

export default pushCronjobModel;
