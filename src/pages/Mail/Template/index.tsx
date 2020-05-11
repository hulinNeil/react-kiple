import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Card, Button, Table, Form, Input, Select } from 'antd';
import { router, useSelector, useDispatch, Dispatch } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { TemplateKindEnum } from '@/config/smsMail';
import { History } from 'history';
import Page from '@/components/Page';
import CustomModal from '@/components/CustomModal';
import CartTitleForm from '@/components/Form/CardTitileForm';
import { renderColTime, renderColKind } from '@/components/TableHeader';
import { ColumnProps } from 'antd/es/table';
import { ConnectState } from '@/models';
import { MailTemplateItem } from '@/services/mail/template';
import { openNewWindow } from '@/utils/tools';
import { PaginationConfig } from 'antd/es/pagination';
import { MailTemplateState } from '@/models/mail/template';
import './index.less';

interface TemplateProps extends RouteComponentProps {
  history: History;
}

const { withRouter } = router;
const kinds = [0, 1, 2, 3];

const Template: React.FC<TemplateProps> = ({ history }) => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const dataList = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.dataList);
  const isLoading = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.isLoading);
  const isShouldRefresh = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.isShouldRefresh);
  const pagination = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.pagination);
  const dispatch = useDispatch<Dispatch>();
  const formValue = { templateName: '', kind: 0 };

  // get Email template list
  const getList = async () => {
    const { templateName, kind } = formValue;
    dispatch({
      type: 'mailTemplate/getTemplateList',
      payload: {
        kind,
        name: templateName,
      },
    });
  };

  // delete Email template
  const handleDel = ({ id, templateName }: MailTemplateItem) => {
    CustomModal.warning({
      title: intl.get('sms.tpl.delete'),
      content: intl.get('mail.tpl.delete.title', { name: templateName }),
      onOk: async () => {
        await dispatch({
          type: 'mailTemplate/deleteTemplate',
          payload: { id },
        });
      },
    });
  };
  // create or edite Email template
  // new template is created when item is false
  const jumpCreatePage = (item: MailTemplateItem | false) => {
    if (item) {
      const editIndex = item ? dataList.findIndex((e) => e.id === item.id) : -1;
      dispatch({
        type: 'mailTemplate/change',
        payload: { editIndex },
      });
    }
    history.push('/mail/create-template');
  };

  // pagination change
  const onPaginationChnage = (e: PaginationConfig) => {
    dispatch({
      type: 'mailTemplate/change',
      payload: { pagination: { ...pagination, current: e.current || 1 } },
    });
  };

  useEffect(() => {
    if (isShouldRefresh) {
      getList();
    }
  }, [pagination.current]);

  // reset redux data or modify isShouldRefresh for save current state
  useEffect(() => {
    return () => {
      if (location.pathname !== '/mail/create-template') {
        dispatch({ type: 'mailTemplate/reset' });
      } else {
        dispatch({
          type: 'mailTemplate/change',
          payload: { isShouldRefresh: false },
        });
      }
    };
  }, []);

  // card form search
  const searchTemplate = ({ templateName, kind }: any) => {
    formValue.templateName = templateName;
    formValue.kind = kind;
    getList();
  };

  const title = (
    <CartTitleForm
      title={permission ? intl.get('sms.tpl.create') : ''}
      onLeftClick={() => jumpCreatePage(false)}
      onFinish={searchTemplate}
      initialValues={formValue}
    >
      <Form.Item label={intl.get('sms.tpl.name')} name="templateName">
        <Input type="text" />
      </Form.Item>
      <Form.Item label={intl.get('mail.tpl.type')} name="kind">
        <Select placeholder={intl.get('mail.tpl.select.type')}>
          {kinds.map((value, index) => (
            <Select.Option key={`kind-${index}`} value={index}>
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
  const renderColButton = (item: MailTemplateItem) => {
    return (
      <span className="template-operation">
        <Button size="small" onClick={() => openNewWindow(item.content)}>
          {intl.get('preview')}
        </Button>
        {permission === 1 && (
          <>
            <Button size="small" onClick={() => jumpCreatePage(item)}>
              {intl.get('edit')}
            </Button>
            <Button size="small" onClick={() => handleDel(item)}>
              {intl.get('delete')}
            </Button>
          </>
        )}
      </span>
    );
  };
  // table header
  const columns: ColumnProps<MailTemplateItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: intl.get('sms.tpl.name'),
      dataIndex: 'templateName',
    },
    {
      title: intl.get('mail.tpl.type'),
      dataIndex: 'kind',
      render: renderColKind,
    },
    {
      title: intl.get('sms.tpl.lastEditTime'),
      dataIndex: 'lastEditTime',
      render: renderColTime,
    },
    {
      title: intl.get('sms.tpl.operate'),
      render: renderColButton,
    },
  ];

  return (
    <Page title={intl.get('sms.tpl.title')} className="mail-tpl">
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
    </Page>
  );
};

export default withRouter(Template);
