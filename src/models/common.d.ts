export interface Pagination {
  defaultPageSize: number;
  total: number;
  current: number;
}

interface BusinessData {
  isLoading: boolean;
  isLoadedData: boolean;
  curIndex: number;
  rawData: Array<{
    buKind: string;
    buId: number;
    children: string[];
  }>;
}