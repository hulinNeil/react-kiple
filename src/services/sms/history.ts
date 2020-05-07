import { post } from '@/utils/send';
import { ResponseType } from '../common';

// 历史短信API（sms history API）

export interface SmsHistoryParamsType {
  begin: number;
  end: number;
  status: number;
  to: string;
  pageNo: number;
}

export interface SmsHistoryItem {
  receivedUserSms: string;
  sendTime: number;
  emailStatus: number;
  statusDescribe: string;
  templateName: string;
  mailTitle: number;
  emailContent: string;
}

export interface SmsHistoryType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: SmsHistoryItem[];
  };
}

export const getSmsHistory = (params: SmsHistoryParamsType): Promise<SmsHistoryType> => {
  return post('/sms/historylist', params);
};
