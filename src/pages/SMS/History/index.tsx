import React from 'react';
import moment, { Moment } from 'moment';
import intl from 'react-intl-universal';
import { PaginationConfig } from 'antd/lib/pagination';
import { Card, Button, Table, Form, Select, Input } from 'antd';
import Page from '@/components/Page';
import { renderColTime, renderColStatus } from '@/components/TableHeader';
import DateSearch from '@/components/DateSearch';
import { ColumnProps } from 'antd/es/table';
import { getSmsHistory, SmsHistoryItem, SmsHistoryType, SmsHistoryParamsType } from '@/services/sms/history';
import { validateTelContent } from '@/utils/validateForm';
import { useInitialList } from '@/utils/hooks';
import './index.less';

const History: React.FC<{}> = () => {
  const currentDate = moment();
  const payload = {
    begin: moment(currentDate.format('YYYY-MM-DD')).unix() * 1000,
    end: moment(currentDate.format('YYYY-MM-DD')).unix() * 1000 + 24 * 60 * 60 * 1000 - 1,
    status: 0,
    to: '',
    pageNo: 1,
  };
  const { isLoading, setLoading, dataList, pagination, setPagination, params } = useInitialList<SmsHistoryType, SmsHistoryParamsType, SmsHistoryItem>(
    getSmsHistory,
    payload,
    []
  );

  // change search date
  const onDateChange = (e: [Moment, Moment]) => {
    params.current.begin = moment(e[0].format('YYYY-MM-DD')).unix() * 1000;
    params.current.end = moment(e[1].format('YYYY-MM-DD')).unix() * 1000 + 24 * 60 * 60 * 1000 - 1;
    setLoading(true);
  };

  const onPaginationChang = (e: PaginationConfig) => {
    params.current.pageNo = e.current || 1;
    setPagination({ ...pagination, current: e.current || 1 });
  };

  const searchHistaory = ({ to, status }: any) => {
    params.current.to = to;
    params.current.status = status;
    setLoading(true);
  };

  const columns: ColumnProps<SmsHistoryItem>[] = [
    {
      title: intl.get('tel'),
      dataIndex: 'receivedUserSms',
      width: 110,
    },
    {
      title: intl.get('sms.history.content'),
      dataIndex: 'smsContent',
    },
    {
      title: intl.get('sms.send.time'),
      dataIndex: 'sendTime',
      render: renderColTime,
      width: 150,
    },
    {
      title: intl.get('sms.history.status'),
      dataIndex: 'smsStatus',
      width: 90,
      render: renderColStatus,
    },
    {
      title: intl.get('sms.history.remark'),
      dataIndex: 'statusDescribe',
    },
  ];

  return (
    <Page className="sms-sent" title={intl.get('sms.history.title')}>
      <DateSearch onChange={onDateChange} />
      <Card bordered={true}>
        <Form className="sms-sent-search-form" name="search" onFinish={searchHistaory} initialValues={params.current}>
          <Form.Item label={intl.get('tel')} name="to" className="form-tel-number" rules={[{ validator: validateTelContent }]}>
            <Input type="text" maxLength={14} />
          </Form.Item>
          <Form.Item label={intl.get('sms.history.status')} name="status">
            <Select>
              <Select.Option value={0}>{intl.get('all')}</Select.Option>
              <Select.Option value={1}>{intl.get('sms.status.pending')}</Select.Option>
              <Select.Option value={2}>{intl.get('sms.status.success')}</Select.Option>
              <Select.Option value={3}>{intl.get('sms.status.fail')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="submit">
            <Button type="primary" htmlType="submit">
              {intl.get('search')}
            </Button>
          </Form.Item>
        </Form>
        <Table
          size="small"
          loading={isLoading}
          columns={columns}
          rowKey="id"
          dataSource={dataList}
          bordered
          onChange={onPaginationChang}
          pagination={pagination}
        />
      </Card>
    </Page>
  );
};

export default History;
