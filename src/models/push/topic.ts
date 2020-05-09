import { message } from 'antd';
import intl from 'react-intl-universal';
import { Model } from 'dva';
import { createPushTopic, getPushTopicList, deletePushTopic, PushTopicType, PushTopicItem } from '@/services/push/topic';
import { Pagination } from '@/models/common';

export interface PushTopicState {
  dataList: PushTopicItem[];
  isLoading: boolean;
  pagination: Pagination;
  confirmLoading: boolean;
  dialogVisible: boolean;
  osIndex: number;
}

export interface PushTopicModel extends Model {
  state: PushTopicState;
}

const initState: PushTopicState = {
  dataList: [],
  isLoading: true,
  confirmLoading: false,
  dialogVisible: false,
  osIndex: 0,
  pagination: { defaultPageSize: 10, total: 0, current: 1 },
};

const pushTopicModel: PushTopicModel = {
  namespace: 'pushTopic',
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
    *createTopic({ payload }, { put }) {
      yield put({
        type: 'change',
        payload: { confirmLoading: true },
      });
      const result = yield createPushTopic(payload);
      if (result && result.code === 0) {
        message.success(intl.get('push.topic.create.success'));
        // hide dialog of create
        yield put({
          type: 'change',
          payload: {
            dialogVisible: false,
          },
        });
        // get list data again
        yield put({
          type: 'getTopicList',
        });
      }
      yield put({
        type: 'change',
        payload: {
          confirmLoading: false,
        },
      });
    },
    *deleteTopic({ payload }, { put }) {
      const result = yield deletePushTopic({ id: payload.id });
      if (result && result.code === 0) {
        message.success(intl.get('push.topic.delete.success'));
        yield put({
          type: 'getTopicList',
        });
      }
    },
    *getTopicList(_, { put, select }) {
      const pushTopicState: PushTopicState = yield select((state: { pushTopic: PushTopicState }) => state.pushTopic);
      yield put({
        type: 'change',
        payload: { isLoading: true },
      });

      const { current } = pushTopicState.pagination;
      const result: PushTopicType = yield getPushTopicList({ pageNo: current });
      if (result && result.code === 0 && result.data) {
        pushTopicState.dataList = result.data.list || [];
        pushTopicState.pagination.total = result.data.totalCount;
      }
      pushTopicState.isLoading = false;
      yield put({
        type: 'change',
        payload: { ...pushTopicState },
      });
    },
  },
};

export default pushTopicModel;
