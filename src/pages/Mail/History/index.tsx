import React from 'react';
import moment, { Moment } from 'moment';
import intl from 'react-intl-universal';
import { PaginationConfig } from 'antd/lib/pagination';
import { Card, Button, Table, Form, Select, Input } from 'antd';
import Page from '@/components/Page';
import { renderColTime, renderColStatus } from '@/components/TableHeader';
import DateSearch from '@/components/DateSearch';
import { ColumnProps } from 'antd/es/table';
import { MailHistoryItem, getMailHistory, MailHistoryParamsType, MailHistoryType } from '@/services/mail/history';
import { HistoryStatusEnum } from '@/config/smsMail';
import { openNewWindow } from '@/utils/tools';
import { useInitialList } from '@/utils/hooks';
import './index.less';

const statuses = [0, 1, 2, 3];

const History: React.FC<{}> = () => {
  const currentDate = moment();
  const payload = {
    begin: moment(currentDate.format('YYYY-MM-DD')).unix() * 1000,
    end: moment(currentDate.format('YYYY-MM-DD')).unix() * 1000 + 24 * 60 * 60 * 1000 - 1,
    status: 0,
    email: '',
    pageNo: 1,
  };
  const { isLoading, setLoading, dataList, pagination, setPagination, params } = useInitialList<
    MailHistoryType,
    MailHistoryParamsType,
    MailHistoryItem
  >(getMailHistory, payload, []);

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

  const searchHistaory = ({ email, status }: any) => {
    params.current.email = email;
    params.current.status = status;
    setLoading(true);
  };

  const renderColButton = (item: MailHistoryItem) => {
    return (
      <span className="template-operation">
        <Button size="small" onClick={() => openNewWindow(item.emailContent)}>
          {intl.get('preview')}
        </Button>
      </span>
    );
  };

  const columns: ColumnProps<MailHistoryItem>[] = [
    {
      title: intl.get('mail.tpl.title'),
      dataIndex: 'emailTitle',
    },
    {
      title: intl.get('sms.send.to'),
      dataIndex: 'receivedUserEmail',
    },
    {
      title: intl.get('sms.send.time'),
      dataIndex: 'sendTime',
      render: renderColTime,
    },
    {
      title: intl.get('sms.history.status'),
      dataIndex: 'emailStatus',
      render: renderColStatus,
    },
    {
      title: intl.get('sms.history.remark'),
      dataIndex: 'statusDescribe',
    },
    {
      title: intl.get('sms.tpl.operate'),
      render: renderColButton,
    },
  ];

  return (
    <Page className="sms-sent" title={intl.get('mail.history.title')}>
      <DateSearch onChange={onDateChange} />
      <Card bordered={true}>
        <Form className="sms-sent-search-form" name="search" onFinish={searchHistaory} initialValues={params.current}>
          <Form.Item label={intl.get('mail.history.to')} name="email" className="form-tel-number">
            <Input type="text" />
          </Form.Item>
          <Form.Item label={intl.get('sms.history.status')} name="status">
            <Select>
              {statuses.map((status) => (
                <Select.Option value={status} key={`status-${status}`}>
                  {intl.get(HistoryStatusEnum[status])}
                </Select.Option>
              ))}
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
