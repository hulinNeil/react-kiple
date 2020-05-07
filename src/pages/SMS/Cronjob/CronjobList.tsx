import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { Card, Button, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import { ColumnProps } from 'antd/es/table';
import CustomModal from '@/components/CustomModal';
import CartTitleForm from '@/components/Form/CardTitileForm';
import { renderColTime, renderColStatus, renderColCount } from '@/components/TableHeader';
import { SmsCronjobItem } from '@/services/sms/cronjob';
import { ConnectState } from '@/models';
import { SmsCronjobState } from '@/models/sms/cronjob';

const CronjobList: React.FC<{}> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const dataList = useSelector((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob.dataList);
  const isLoading = useSelector((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob.isLoading);
  const pagination = useSelector((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob.pagination);
  const dispatch = useDispatch<Dispatch>();

  // get sms cronjob list
  const getList = () => {
    dispatch({
      type: 'smsCronjob/getCronjobList',
    });
  };

  // delete sms cronjob
  const handleDel = ({ id }: SmsCronjobItem) => {
    CustomModal.warning({
      title: intl.get('sms.send.delete'),
      content: intl.get('sms.send.delete.title'),
      onOk: async () => {
        await dispatch({
          type: 'smsCronjob/deleteCronjob',
          payload: { id },
        });
      },
    });
  };

  // show create view
  const showModal = () => {
    dispatch({
      type: 'smsCronjob/change',
      payload: { dialogVisible: true },
    });
  };

  // pagination change
  const onPaginationChnage = (e: PaginationConfig) => {
    dispatch({
      type: 'smsCronjob/change',
      payload: { pagination: { ...pagination, current: e.current || 1 } },
    });
  };

  useEffect(() => {
    getList();
  }, [pagination.current]);

  const title = permission === 1 && <CartTitleForm title={intl.get('sms.send.create')} onLeftClick={() => showModal()}></CartTitleForm>;
  const renderColButton = (item: SmsCronjobItem) => {
    return (
      <span>
        <Button size="small" onClick={() => handleDel(item)}>
          {intl.get('delete')}
        </Button>
      </span>
    );
  };

  const columns: ColumnProps<SmsCronjobItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: intl.get('sms.tpl.name'),
      dataIndex: 'templateName',
      width: 100,
    },
    {
      title: intl.get('sms.tpl.content'),
      dataIndex: 'content',
    },
    {
      title: intl.get('sms.send.status'),
      dataIndex: 'status',
      render: renderColStatus,
      width: 80,
    },
    {
      title: intl.get('sms.send.time'),
      dataIndex: 'sendTime',
      render: renderColTime,
      width: 150,
    },
    {
      title: intl.get('sms.send.count'),
      dataIndex: 'to',
      width: 90,
      render: renderColCount,
    },
  ];
  if (permission === 1) {
    columns.push({
      title: intl.get('sms.tpl.operate'),
      render: renderColButton,
    });
  }
  return (
    <Card title={title} loading={false} bordered={true}>
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey="id"
        dataSource={dataList}
        bordered
        onChange={onPaginationChnage}
        pagination={pagination}
      />
    </Card>
  );
};

export default CronjobList;
