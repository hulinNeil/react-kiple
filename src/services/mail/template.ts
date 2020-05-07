import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 邮件模板API（mail template API）
export interface CreateMailParamsType {
  id?: number;
  templateName: string;
  title: string;
  content: string;
  buId: number;
  buSystem: string;
  rule: number;
  kind: number;
  channel: number;
  placeholderCount: number;
}

export interface MailTemplateItem extends CreateMailParamsType {
  id: number;
  buKind: string;
  lastEditTime: number;
}

export interface GetTemplateParamsType extends GetParamsType {
  name: string;
  kind: number;
}

export interface MailTemplateType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: MailTemplateItem[];
  };
}

export const createMailTemplate = (params: CreateMailParamsType): Promise<MailTempleteType> => {
  return post('/email/newtemplate', params);
};

export const editMailTemplate = (params: CreateMailParamsType): Promise<MailTempleteType> => {
  return post('/email/edittemplate', params);
};

export const delMailTemplate = (params: DelParamsType): Promise<ResponseType> => {
  return del('/email/deltemplate', params);
};

export const getMailTemplateList = (params: GetTemplateParamsType): Promise<MailTempleteType> => {
  return get('/email/templatelist', params);
};
