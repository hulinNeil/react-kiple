import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 邮件定时任务API（mail cronjob API）
export interface CreateParamsType {
  channelId: number;
  templateId: number;
  to: string[];
  replaceWord: string[];
  sendTime: number;
}

export interface MailCronjobItem extends CreateParamsType {
  id: number;
  kind: number;
  content: string;
  templateName: string;
}

export interface MailCronjobType extends ResponseType {
  data?: {
    totalCount: number;
    pageNo: number;
    list: MailCronjobItem[];
  };
}

export const createMailCronjob = (params: CreateParamsType): Promise<ResponseType> => {
  return post('/email/newcronjob', params);
};

export const deleteMailCronjob = (params: DelParamsType): Promise<ResponseType> => {
  return del('/email/delcronjob', params);
};

export const getMailCronjobList = (params: GetParamsType): Promise<MailCronjobType> => {
  return get('/email/cronjoblist', params);
};
