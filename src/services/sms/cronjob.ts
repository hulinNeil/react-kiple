import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 短信定时任务API（sms cronjob API）
export interface CreateParamsType {
  channelId: number;
  templateId: number;
  to: string[];
  replaceWord: string[];
  sendTime: number;
}

export interface SmsCronjobItem extends CreateParamsType {
  id: number;
  kind: number;
  content: string;
  templateName: string;
}

export interface SmsCronjobType extends ResponseType {
  data?: {
    totalCount: number;
    pageNo: number;
    list: SmsCronjobItem[];
  };
}

export const createSmsCronjob = (params: CreateParamsType): Promise<ResponseType> => {
  return post('/sms/newcronjob', params);
};

export const deleteSmsCronjob = (params: DelParamsType): Promise<ResponseType> => {
  return del('/sms/delcronjob', params);
};

export const getSmsCronjobList = (params: GetParamsType): Promise<SmsCronjobType> => {
  return get('/sms/cronjoblist', params);
};
