import React, { useState, useImperativeHandle } from 'react';
import intl from 'react-intl-universal';
import { Form, Input } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import ConfirmPwdItem from '@/components/Form/ConfirmPwdItem';
import { validatePassword } from '@/utils/validateForm';

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
      title={`${intl.get('reset')}${passwordType === 1 ? intl.get('login') : intl.get('pay')}${intl.get('pwd')}`}
      visible={dialogVisible}
      confirmLoading={confirmLoading}
      onCancel={hideRestPassword}
      onOk={onOk}
    >
      <Form.Item label={intl.get('old') + intl.get('pwd')} name="old" required={true} rules={[{ validator: validatePassword }]}>
        <Input type="password" placeholder={intl.get('pwd.edit', { type: intl.get('old') })} />
      </Form.Item>
      <ConfirmPwdItem lable={intl.get('new') + intl.get('pwd')} />
    </ModalForm>
  );
};

export default ResetPassword;
