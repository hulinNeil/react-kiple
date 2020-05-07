import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 敏感词相关API（sensitiveword API）mail && sms

export interface CreateParamsType {
  word: string;
}

export interface SensitiveWordItem extends CreateParamsType {
  id: number;
  editTime: number;
}

export interface SensitiveWordType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: SensitiveWordItem[];
  };
}

export const createWord = (params: CreateParamsType): Promise<ResponseType> => {
  console.log(params);
  return post('/newsensitiveword', params);
};

export const deleteWord = (params: DelParamsType): Promise<ResponseType> => {
  return del('/delsensitiveword', params);
};

export const getWordList = (params: GetParamsType): Promise<SensitiveWordType> => {
  return get('/sensitivewordlist', params);
};
