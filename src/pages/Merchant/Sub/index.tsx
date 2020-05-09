import React from 'react';
import { Card, Table } from 'antd';
// import intl from 'react-intl-universal';
import Page from '@/components/Page';

const Sub = () => {
  const dataList: any[] = [];
  const isLoading = false;
  const pagination = { defaultPageSize: 10, total: 0, current: 1 };
  // table header
  const columns = [
    {
      title: '商户名称',
      dataIndex: 'name',
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
    <Page title="子商户管理">
      <Card bordered={true}>
        <Table size="small" loading={isLoading} columns={columns} rowKey="id" dataSource={dataList} bordered pagination={pagination} />
      </Card>
    </Page>
  );
};

export default Sub;
