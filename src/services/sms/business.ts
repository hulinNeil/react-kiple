import { get } from '@/utils/send';
import { ResponseType } from '../common';

// sms business list
export interface SmsBusinessItem {
  id: number;
  buId: number;
  buKind: string;
  budescript: string;
  buSystem: string;
  busysdescript: string;
  restatus: number;
}

export interface SmsBusinessType extends ResponseType {
  data?: {
    totalCount: number;
    pageNo: number;
    list: SmsBusinessItem[];
  };
}

export const getSmsBusinessList = (): Promise<SmsBusinessType> => {
  return get('/sms/businesslist', {});
};
