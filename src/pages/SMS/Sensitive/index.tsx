import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector } from 'dva';
import { ColumnProps } from 'antd/es/table';
import { PaginationConfig } from 'antd/lib/pagination';
import { Card, Button, Table, Form, Input, message } from 'antd';
import Page from '@/components/Page';
import ModalForm from '@/components/Form/ModalForm';
import CustomModal from '@/components/CustomModal';
import { renderColTime } from '@/components/TableHeader';
import { getWordList, deleteWord, createWord, SensitiveWordItem, SensitiveWordType } from '@/services/sms/sensitiveword';
import { ConnectState } from '@/models';
import { useInitialList } from '@/utils/hooks';
import { GetParamsType } from '@/services/common';

const Sensitive = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const { isLoading, setLoading, dataList, pagination, setPagination, params } = useInitialList<SensitiveWordType, GetParamsType, SensitiveWordItem>(
    getWordList,
    { pageNo: 1 },
    []
  );

  // del item sensitive word
  const handleDel = (item: SensitiveWordItem) => {
    CustomModal.warning({
      title: intl.get('sms.sensitive.delete'),
      content: intl.get('sms.sensitive.delete.title', { word: item.word }),
      onOk: async () => {
        const result = await deleteWord({ id: item.id });
        if (result && result.code === 0) {
          message.success(intl.get('sms.sensitive.delete.success'));
          setLoading(true);
        }
      },
    });
  };

  const onCancel = () => {
    setDialogVisible(false);
  };

  const createSensitiveWord = async (item: SensitiveWordItem) => {
    setConfirmLoading(true);
    const result = await createWord({ word: item.word });
    if (result.code === 0) {
      message.success(intl.get('sms.sensitive.create.success'));
      setLoading(true);
    }
    setConfirmLoading(false);
    onCancel();
  };

  const onPaginationChang = (e: PaginationConfig) => {
    params.current.pageNo = e.current || 1;
    setPagination({ ...pagination, current: e.current || 1 });
  };

  // button for create sensitive word
  const title = permission === 1 && (
    <Button type="primary" onClick={() => setDialogVisible(true)}>
      {intl.get('sms.sensitive.create')}
    </Button>
  );
  const renderColButton = (item: SensitiveWordItem) => {
    return (
      <>
        <Button size="small" onClick={() => handleDel(item)}>
          {intl.get('delete')}
        </Button>
      </>
    );
  };

  const columns: ColumnProps<SensitiveWordItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: intl.get('sms.sensitive'),
      dataIndex: 'word',
    },
    {
      title: intl.get('sms.tpl.lastEditTime'),
      dataIndex: 'editTime',
      render: renderColTime,
    },
  ];
  if (permission === 1) {
    columns.push({
      title: intl.get('sms.tpl.operate'),
      render: renderColButton,
    });
  }

  return (
    <Page title={intl.get('sms.sensitive.title')}>
      <Card title={title} loading={false} bordered={true}>
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
      <ModalForm
        title={intl.get('sms.sensitive.create')}
        confirmLoading={confirmLoading}
        visible={dialogVisible}
        onCancel={onCancel}
        onOk={createSensitiveWord}
      >
        <Form.Item label={intl.get('sms.sensitive')} name="word" rules={[{ required: true, message: intl.get('sms.sensitive.no.create') }]}>
          <Input type="text" placeholder={intl.get('sms.sensitive.create.placeholder')} />
        </Form.Item>
      </ModalForm>
    </Page>
  );
};

export default Sensitive;
