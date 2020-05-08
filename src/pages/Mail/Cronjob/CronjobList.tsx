import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { Card, Button, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { PaginationConfig } from 'antd/lib/pagination';
import CustomModal from '@/components/CustomModal';
import CartTitleForm from '@/components/Form/CardTitileForm';
import { renderColTime, renderColCount, renderColStatus } from '@/components/TableHeader';
import { ConnectState } from '@/models';
import { MailCronjobState } from '@/models/mail/cronjob';
import { openNewWindow } from '@/utils/tools';
import { MailCronjobItem } from '@/services/mail/cronjob';

const CronjobList: React.FC<{}> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const dataList = useSelector((state: { mailCronjob: MailCronjobState }) => state.mailCronjob.dataList);
  const isLoading = useSelector((state: { mailCronjob: MailCronjobState }) => state.mailCronjob.isLoading);
  const pagination = useSelector((state: { mailCronjob: MailCronjobState }) => state.mailCronjob.pagination);
  const dispatch = useDispatch<Dispatch>();

  // get sms cronjob list
  const getList = () => {
    dispatch({
      type: 'mailCronjob/getCronjobList',
    });
  };

  // delete sms cronjob
  const handleDel = ({ id }: MailCronjobItem) => {
    CustomModal.warning({
      title: intl.get('sms.send.delete'),
      content: intl.get('sms.send.delete.title'),
      onOk: async () => {
        await dispatch({
          type: 'mailCronjob/deleteCronjob',
          payload: { id },
        });
      },
    });
  };

  // show create view
  const showModal = () => {
    dispatch({
      type: 'mailCronjob/change',
      payload: { dialogVisible: true },
    });
  };

  // pagination change
  const onPaginationChnage = (e: PaginationConfig) => {
    dispatch({
      type: 'mailCronjob/change',
      payload: { pagination: { ...pagination, current: e.current || 1 } },
    });
  };

  useEffect(() => {
    getList();
  }, [pagination.current]);

  const title = permission === 1 && <CartTitleForm title={intl.get('sms.send.create')} onLeftClick={() => showModal()}></CartTitleForm>;
  const renderColButton = (item: MailCronjobItem) => {
    return (
      <span>
        <Button size="small" onClick={() => openNewWindow(item.content)}>
          {intl.get('preview')}
        </Button>
        {'  '}
        <Button size="small" onClick={() => handleDel(item)}>
          {intl.get('delete')}
        </Button>
      </span>
    );
  };

  const columns: ColumnProps<MailCronjobItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: intl.get('sms.tpl.name'),
      dataIndex: 'templateName',
    },
    {
      title: intl.get('sms.send.status'),
      dataIndex: 'status',
      render: renderColStatus,
    },
    {
      title: intl.get('sms.send.time'),
      dataIndex: 'sendTime',
      render: renderColTime,
    },
    {
      title: intl.get('sms.send.count'),
      dataIndex: 'to',
      render: renderColCount,
    },
  ];
  if (permission === 1) { // check user permission to show operate button
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
