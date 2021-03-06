import React from 'react';
import { Card, Table } from 'antd';
// import intl from 'react-intl-universal';
import Page from '@/components/Page';

const User = () => {
  const dataList: any[] = [];
  const isLoading = false;
  const pagination = { defaultPageSize: 10, total: 0, current: 1 };
  // table header
  const columns = [
    {
      title: '用户名称',
      dataIndex: 'name',
    },
    {
      title: '用户类型',
      dataIndex: 'kind',
    },
    {
      title: '帐号ID',
      dataIndex: 'buKind',
    },
    {
      title: '操作',
    },
  ];
  return (
    <Page title="用户管理">
      <Card bordered={true}>
        <Table size="small" loading={isLoading} columns={columns} rowKey="id" dataSource={dataList} bordered pagination={pagination} />
      </Card>
    </Page>
  );
};

export default User;
