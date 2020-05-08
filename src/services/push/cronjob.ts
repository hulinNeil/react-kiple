import { get, post, del } from '@/utils/send';
import { ResponseType, DelParamsType, GetParamsType } from '../common';

// 推送定时任务API(push cronjob API)
export interface PushCreateParamsType {
  topic: number;
  title: string;
  content: string;
  body:
    | ''
    | {
        [key: string]: string;
      };
  picUrl: string;
  sendTime: number;
}

export interface PushCronjobItem extends PushCreateParamsType {
  id: number;
}

export interface PushCronjobType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: PushCronjobItem[];
  };
}

export const createPushCronjob = (params: PushCreateParamsType): Promise<ResponseType> => {
  return post('/push/newcronjob', params);
};

export const deletePushCronjob = (params: DelParamsType): Promise<ResponseType> => {
  return del('/push/delcronjob', params);
};

export const getPushCronjobList = (params: GetParamsType): Promise<PushCronjobType> => {
  return get('/push/cronjoblist', params);
};
