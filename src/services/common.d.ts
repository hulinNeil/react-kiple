export interface ResponseType {
  code: number;
  message: string;
}

export interface ListResponseType extends ResponseType {
  data: {
    totalCount: number;
    pageNo: number;
    list: any[];
  };
}

export interface DelParamsType {
  id: number;
}

export interface GetParamsType {
  pageNo: number;
}
