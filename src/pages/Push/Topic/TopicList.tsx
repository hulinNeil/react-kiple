import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { ColumnProps } from 'antd/es/table';
import { PaginationConfig } from 'antd/lib/pagination';
import { Card, Button, Table } from 'antd';
import CustomModal from '@/components/CustomModal';
import CartTitleForm from '@/components/Form/CardTitileForm';
import { renderColOS, renderColPushVersion } from '@/components/TableHeader';
import { ConnectState } from '@/models';
import { PushTopicState } from '@/models/push/topic';
import { PushTopicItem } from '@/services/push/topic';

const TopicList: React.FC<{}> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const dataList = useSelector((state: { pushTopic: PushTopicState }) => state.pushTopic.dataList);
  const isLoading = useSelector((state: { pushTopic: PushTopicState }) => state.pushTopic.isLoading);
  const pagination = useSelector((state: { pushTopic: PushTopicState }) => state.pushTopic.pagination);
  const dispatch = useDispatch<Dispatch>();

  // show modal for create push topic
  const showModal = () => {
    dispatch({
      type: 'pushTopic/change',
      payload: {
        dialogVisible: true,
      },
    });
  };

  // delete push topic
  const handleDel = ({ id }: PushTopicItem) => {
    CustomModal.warning({
      title: intl.get('push.topic.delete'),
      content: intl.get('push.topic.delete.title'),
      onOk: async () => {
        await dispatch({
          type: 'pushTopic/deleteTopic',
          payload: { id },
        });
      },
    });
  };

  // pagination change
  const onPaginationChnage = (e: PaginationConfig) => {
    dispatch({
      type: 'pushTopic/change',
      payload: { pagination: { ...pagination, current: e.current || 1 } },
    });
  };

  // listen pagination to refresh the list
  useEffect(() => {
    dispatch({
      type: 'pushTopic/getTopicList',
    });
  }, [pagination.current]);

  // card title: create button && search view
  const title = permission === 1 && <CartTitleForm title={intl.get('push.topic.create')} onLeftClick={() => showModal()}></CartTitleForm>;
  const renderColButton = (item: PushTopicItem) => {
    return (
      <span>
        <Button size="small" onClick={() => handleDel(item)}>
          {intl.get('delete')}
        </Button>
      </span>
    );
  };
  // table header
  const columns: ColumnProps<PushTopicItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: intl.get('push.topic.name'),
      dataIndex: 'name',
    },
    {
      title: intl.get('push.topic.describe'),
      dataIndex: 'describe',
    },
    {
      title: intl.get('push.topic.os'),
      dataIndex: 'os',
      render: renderColOS,
    },
    {
      title: intl.get('push.topic.osVersion'),
      dataIndex: 'osVersion',
      width: 100,
      render: renderColPushVersion,
    },
    {
      title: intl.get('push.topic.appVersion'),
      dataIndex: 'appVersion',
      width: 100,
      render: renderColPushVersion,
    },
    {
      title: intl.get('push.topic.appName'),
      dataIndex: 'appName',
      render: renderColPushVersion,
    },
  ];
  if (permission === 1) {
    columns.push({
      title: intl.get('sms.tpl.operate'),
      width: 70,
      render: renderColButton,
    });
  }

  return (
    <Card title={title} bordered={true}>
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

export default TopicList;
