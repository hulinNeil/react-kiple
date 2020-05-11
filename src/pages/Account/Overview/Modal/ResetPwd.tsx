import React, { useState, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';
import ModalForm from '@/components/Form/ModalForm';

const ResetPassword = ({ cRef }: { cRef: any }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(1); // 1 reset login pwd, 2 reset pay pwd

  const hideRestPassword = () => {
    setDialogVisible(false);
  };
  const showRestPassword = (type: number) => {
    setPasswordType(type);
    setDialogVisible(true);
  };
  const onOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      hideRestPassword();
      setConfirmLoading(false);
    }, 2000);
  };

  useImperativeHandle(cRef, () => ({
    hideRestPassword,
    showRestPassword,
  }));

  return (
    <ModalForm
      title={`重置${passwordType === 1 ? '登录' : '支付'}密码`}
      visible={dialogVisible}
      confirmLoading={confirmLoading}
      onCancel={hideRestPassword}
      onOk={onOk}
    >
      <Form.Item label="原始密码" name="old" required={true}>
        <Input type="password" placeholder="请输入原始密码" />
      </Form.Item>
      <Form.Item label="新密码" name="new" required={true}>
        <Input type="password" placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item label="确认密码" name="again" required={true}>
        <Input type="password" placeholder="再次输入新密码" />
      </Form.Item>
    </ModalForm>
  );
};

export default ResetPassword;
