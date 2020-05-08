import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Card, Button, Table } from 'antd';
import { router, useSelector, useDispatch, Dispatch } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { History } from 'history';
import Page from '@/components/Page';
import CustomModal from '@/components/CustomModal';
import CartTitleForm from '@/components/Form/CardTitileForm';
import { renderColTime, renderColStatus } from '@/components/TableHeader';
import { ColumnProps } from 'antd/es/table';
import { ConnectState } from '@/models';
import { MailTemplateItem } from '@/services/mail/template';
import { PaginationConfig } from 'antd/es/pagination';
import { PushCronjobState } from '@/models/push/record';
import { SmsCronjobItem } from '@/services/sms/cronjob';
// import './index.less';

interface TemplateProps extends RouteComponentProps {
  history: History;
}

const { withRouter } = router;

const Template: React.FC<TemplateProps> = ({ history }) => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const dataList = useSelector((state: { pushCronjob: PushCronjobState }) => state.pushCronjob.dataList);
  const isLoading = useSelector((state: { pushCronjob: PushCronjobState }) => state.pushCronjob.isLoading);
  const isShouldRefresh = useSelector((state: { pushCronjob: PushCronjobState }) => state.pushCronjob.isShouldRefresh);
  const pagination = useSelector((state: { pushCronjob: PushCronjobState }) => state.pushCronjob.pagination);
  const dispatch = useDispatch<Dispatch>();
  const formValue = { templateName: '', kind: 0 };
  console.log(dataList);

  // get Email template list
  const getList = async () => {
    const { templateName, kind } = formValue;
    dispatch({
      type: 'pushCronjob/getCronjobList',
      payload: {
        kind,
        name: templateName,
      },
    });
  };

  // delete push template
  const handleDel = ({ id, templateName }: MailTemplateItem) => {
    CustomModal.warning({
      title: intl.get('push.msg.delete'),
      content: intl.get('push.msg.delete.title'),
      onOk: async () => {
        await dispatch({
          type: 'pushCronjob/deleteCronjob',
          payload: { id },
        });
      },
    });
  };
  // create push message
  const jumpCreatePage = () => {
    history.push('/push/cronjob/create');
  };

  // pagination change
  const onPaginationChnage = (e: PaginationConfig) => {
    dispatch({
      type: 'pushCronjob/change',
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
      if (location.pathname !== '/push/create') {
        dispatch({ type: 'pushCronjob/reset' });
      } else {
        dispatch({
          type: 'pushCronjob/change',
          payload: { isShouldRefresh: false },
        });
      }
    };
  }, []);

  const title = permission === 1 && <CartTitleForm title={intl.get('push.record.create')} onLeftClick={jumpCreatePage}></CartTitleForm>;
  const renderColButton = (item: MailTemplateItem) => {
    return (
      <Button size="small" onClick={() => handleDel(item)}>
        {intl.get('delete')}
      </Button>
    );
  };
  // table header
  const columns: ColumnProps<SmsCronjobItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: intl.get('push.msg.title'),
      dataIndex: 'title',
    },
    {
      title: intl.get('push.msg.content'),
      dataIndex: 'content',
    },
    {
      title: intl.get('push.msg.to'),
      dataIndex: 'to',
    },
    {
      title: intl.get('push.msg.sendTime'),
      dataIndex: 'sendTime',
      render: renderColTime,
    },
    {
      title: intl.get('sms.history.status'),
      dataIndex: 'status',
      render: renderColStatus,
    },
  ];
  if (permission === 1) {
    columns.push({
      title: intl.get('sms.tpl.operate'),
      render: renderColButton,
    });
  }

  return (
    <Page title={intl.get('push.record.title')}>
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
