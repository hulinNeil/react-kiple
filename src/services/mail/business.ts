import { get } from '@/utils/send';
import { ResponseType } from '../common';

// mail business list
export interface MailBusinessItem {
  id: number;
  buId: number;
  buKind: string;
  budescript: string;
  buSystem: string;
  busysdescript: string;
  restatus: number;
}

export interface MailBusinessType extends ResponseType {
  data?: {
    totalCount: number;
    pageNo: number;
    list: MailBusinessItem[];
  };
}

export const getMailBusinessList = (): Promise<MailBusinessType> => {
  return get('/email/businesslist', {});
};
