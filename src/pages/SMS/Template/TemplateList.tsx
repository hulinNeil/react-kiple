import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { ColumnProps } from 'antd/es/table';
import { PaginationConfig } from 'antd/lib/pagination';
import { Card, Button, Table, Form, Input, Select } from 'antd';
import CustomModal from '@/components/CustomModal';
import CartTitleForm from '@/components/Form/CardTitileForm';
import { renderColTime, renderColKind } from '@/components/TableHeader';
import { SmsTemplatelItem } from '@/services/sms/template';
import { ConnectState } from '@/models';
import { SmsTemplateState } from '@/models/sms/template';
import { TemplateKindEnum } from '@/config/smsMail';
import './index.less';

const kinds = [0, 1, 2, 3];

const TemplateList: React.FC<{}> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const dataList = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.dataList);
  const isLoading = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.isLoading);
  const pagination = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.pagination);
  const dispatch = useDispatch<Dispatch>();
  const cardTitleFormValue = { templateName: '', kind: 0 };

  // create or edit template;
  // new template is created when item is false
  const showModal = (item: SmsTemplatelItem | false) => {
    const editIndex = item ? dataList.findIndex((e) => e.id === item.id) : -1;
    dispatch({
      type: 'smsTemplate/change',
      payload: {
        dialogVisible: true,
        editIndex,
      },
    });
  };

  // delete sms template item
  const handleDel = ({ id }: SmsTemplatelItem) => {
    CustomModal.warning({
      title: intl.get('sms.tpl.delete'),
      content: intl.get('sms.tpl.delete.title'),
      onOk: async () => {
        await dispatch({
          type: 'smsTemplate/deleteTemplate',
          payload: { id },
        });
      },
    });
  };

  // pagination change
  const onPaginationChnage = (e: PaginationConfig) => {
    dispatch({
      type: 'smsTemplate/change',
      payload: { pagination: { ...pagination, current: e.current || 1 } },
    });
  };

  // listen pagination to refresh the list
  useEffect(() => {
    dispatch({
      type: 'smsTemplate/getTemplateList',
    });
  }, [pagination.current]);

  // card_form for search
  const searchTemplate = ({ templateName, kind }: any) => {
    dispatch({
      type: 'smsTemplate/getTemplateList',
      payload: {
        kind,
        name: templateName,
      },
    });
  };
  // card title: create button && search view
  const title = (
    <CartTitleForm
      title={permission === 1 ? intl.get('sms.tpl.create') : ''}
      onLeftClick={() => showModal(false)}
      onFinish={searchTemplate}
      initialValues={cardTitleFormValue}
    >
      <Form.Item label={intl.get('sms.tpl.name')} name="templateName">
        <Input type="text" />
      </Form.Item>
      <Form.Item label={intl.get('sms.tpl.type')} name="kind">
        <Select placeholder={intl.get('sms.tpl.select.type')}>
          {kinds.map((value, index) => (
            <Select.Option key={`kind-${index + 1}`} value={index}>
              {intl.get(TemplateKindEnum[value])}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className="submit" style={{ width: 'auto' }}>
        <Button type="primary" htmlType="submit">
          {intl.get('search')}
        </Button>
      </Form.Item>
    </CartTitleForm>
  );
  const renderColButton = (item: SmsTemplatelItem) => {
    return (
      <span>
        <Button size="small" onClick={() => showModal(item)}>
          {intl.get('edit')}
        </Button>
        &nbsp;&nbsp;
        <Button size="small" onClick={() => handleDel(item)}>
          {intl.get('delete')}
        </Button>
      </span>
    );
  };
  // table header
  const columns: ColumnProps<SmsTemplatelItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
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
      title: intl.get('sms.tpl.type'),
      dataIndex: 'kind',
      width: 100,
      render: renderColKind,
    },
    {
      title: intl.get('sms.tpl.lastEditTime'),
      dataIndex: 'lastEditTime',
      width: 150,
      render: renderColTime,
    },
    {
      title: intl.get('sms.tpl.system'),
      dataIndex: 'buSystem',
      width: 100,
    },
  ];
  if (permission === 1) {
    columns.push({
      title: intl.get('sms.tpl.operate'),
      width: 130,
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

export default TemplateList;
