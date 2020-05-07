import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 短信模板API（sms template API）

export interface CreateTemplateParamsType {
  id?: number;
  templateName: string;
  content: string;
  buId: number;
  buSystem: string;
  kind: number;
  rule: number;
  channel: number;
  placeholderCount: number;
}

export interface SmsTemplatelItem extends CreateTemplateParamsType {
  id: number;
  buKind: string;
  lastEditTime: number;
}

export interface GetSmsTemplateParamsType extends GetParamsType {
  name: string;
  kind: number;
}

export interface SmsTemplateType extends ResponseType {
  data?: {
    totalCount: number;
    pageNo: number;
    list: SmsTemplatelItem[];
  };
}

export const createSmsTemplate = (params: CreateTemplateParamsType): Promise<ResponseType> => {
  return post('/sms/newtemplate', params);
};

export const editSmsTemplate = (params: CreateTemplateParamsType): Promise<ResponseType> => {
  return post('/sms/edittemplate', params);
};

export const delSmsTemplate = (params: DelParamsType): Promise<ResponseType> => {
  return del('/sms/deltemplate', params);
};

export const getSmsTemplateList = (params: GetSmsTemplateParamsType): Promise<SmsTemplateType> => {
  return get('/sms/templatelist', params);
};
