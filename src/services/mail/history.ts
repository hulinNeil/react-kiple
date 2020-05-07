import { post } from '@/utils/send';
import { ResponseType } from '../common';

// 历史邮件API（mail history API）

export interface MailHistoryParamsType {
  begin: number;
  end: number;
  status: number;
  email: string;
  pageNo: number;
}

export interface MailHistoryItem {
  receivedUserEmail: string;
  sendTime: number;
  emailStatus: number;
  statusDescribe: string;
  templateName: string;
  mailTitle: number;
  emailContent: string;
}

export interface MailHistoryType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: MailHistoryItem[];
  };
}

export const getMailHistory = function (params: MailHistoryParamsType): Promise<MailHistoryType> {
  const result = post('/email/historylist', params);
  getMailHistory.prototype.cancel = post.prototype.source.cancel;
  return result;
};
