import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 主题相关API(topic API)

export interface PushTopicCreateParamsType {
  name: string;
  describe: string;
  os: string; // android,ios,all('') 
  osVersion: number; // 8.0
  appVersion: number; // 1.0.2
  appName: string;
}

export interface PushTopicItem extends PushTopicCreateParamsType {
  id: number;
  editTime: number;
}

export interface PushTopicType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: PushTopicItem[];
  };
}

export const createPushTopic = (params: PushTopicCreateParamsType): Promise<ResponseType> => {
  return post('/push/newtopic', params);
};

export const deletePushTopic = (params: DelParamsType): Promise<ResponseType> => {
  return del('/push/deltopic', params);
};

export const getPushTopicList = (params: GetParamsType): Promise<PushTopicType> => {
  return get('/push/topiclist', params);
};
