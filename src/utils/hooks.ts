import { useState, useEffect, useRef } from 'react';
import { ListResponseType } from '@/services/common';
import { Pagination } from '@/models/common';

export const useInitialList = <T extends ListResponseType, P, D>(api: (params: P) => Promise<T>, defaultParams: P, defaultData: D[]) => {
  const [isLoading, setLoading] = useState(true);
  const params = useRef<P>(defaultParams);
  const [pagination, setPagination] = useState<Pagination>({ defaultPageSize: 10, total: 0, current: 1 });
  const [dataList, setDataList] = useState<D[]>(defaultData);
  const isUnmount = useRef(false);

  const getList = async () => {
    const result = await api(params.current);
    if (isUnmount.current) {
      return;
    }
    if (result && result.code === 0 && result.data && result.data.list) {
      setDataList(result.data.list);
      setPagination({ ...pagination, total: result.data.totalCount });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    getList();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setLoading(true);
  }, [pagination.current]);

  useEffect(() => {
    return () => {
      isUnmount.current = true;
    };
  }, []);

  return {
    pagination,
    setPagination,
    isLoading,
    setLoading,
    params,
    dataList,
  };
};
