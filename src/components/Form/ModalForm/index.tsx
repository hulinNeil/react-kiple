import React, { useEffect, useRef } from 'react';
import intl from 'react-intl-universal';
import { Form, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';

export interface ModalFormProps {
  title: string;
  initialValues?: any;
  visible: boolean;
  confirmLoading: boolean;
  form?: FormInstance;
  onCancel?: () => void;
  onOk?: (e: any) => void;
}

// reset from value
const useResetFormOnCloseModal = ({ form, visible, initialValues }: any) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && !prevVisible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);
};

const ModalForm: React.FC<ModalFormProps> = ({ form, title, visible, confirmLoading, initialValues, onOk, onCancel, children }) => {
  if (!form) {
    const [formSnyc] = Form.useForm();
    form = formSnyc;
  }
  useResetFormOnCloseModal({ form, visible, initialValues });

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
    form,
    initialValues: initialValues || {},
  };
  return (
    <Form.Provider
      onFormFinish={(name, { values }) => {
        const formValue = Object.assign(initialValues || {}, values);
        formValue.editTime = new Date().getTime();
        onOk && onOk(formValue);
      }}
    >
      <Modal
        okText={intl.get('ok')}
        cancelText={intl.get('cancel')}
        title={title}
        forceRender
        confirmLoading={confirmLoading}
        visible={visible}
        onOk={() => form && form.submit()}
        onCancel={onCancel}
      >
        <Form {...formItemLayout}>{React.Children.map(children, (item) => item)}</Form>
      </Modal>
    </Form.Provider>
  );
};

export default ModalForm;
