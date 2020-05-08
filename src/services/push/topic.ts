import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 主题相关API(topic API)

export interface TopicCreateParamsType {
  name: string;
  describe: string;
  os: string;
  osVersion: string; // 8.0
  appVersion: string; // 1.0.2
  appName: string;
}

export interface TopicItemType extends TopicCreateParamsType {
  id: number;
  editTime: number;
}

export interface TopicType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: TopicItemType[];
  };
}

export const createWord = (params: TopicCreateParamsType): Promise<ResponseType> => {
  return post('/push/newtopic', params);
};

export const deleteWord = (params: DelParamsType): Promise<ResponseType> => {
  return del('/push/deltopic', params);
};

export const getWordList = (params: GetParamsType): Promise<TopicType> => {
  return get('/push/topiclist', params);
};
