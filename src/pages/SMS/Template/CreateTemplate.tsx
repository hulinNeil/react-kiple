import React from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { Form, Input, Select } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import { validateSMSContent, validateEmptyContent } from '@/utils/validateForm';
import { SmsTemplatelItem, CreateTemplateParamsType } from '@/services/sms/template';
import { SmsTemplateState } from '@/models/sms/template';
import { TemplateKindEnum } from '@/config/smsMail';

const kinds = [0, 1, 2, 3];
const CreateTemplate: React.FC<{}> = () => {
  const dialogVisible = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.dialogVisible);
  const confirmLoading = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.confirmLoading);
  const dataList = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.dataList);
  const editIndex = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.editIndex);
  const dispatch = useDispatch<Dispatch>();
  const [form] = Form.useForm();

  const hideModal = () => {
    dispatch({
      type: 'smsTemplate/change',
      payload: {
        dialogVisible: false,
        editIndex: -1,
        confirmLoading: false,
      },
    });
  };
  // create sms template
  const createTemplate = async (item: SmsTemplatelItem) => {
    const { templateName, content, buSystem, kind } = item;
    const placeholderList = content.match(/{\d+}/gi);
    const payload: CreateTemplateParamsType = {
      templateName,
      content,
      kind,
      buId: 0,
      buSystem,
      rule: 1,
      channel: 1,
      placeholderCount: placeholderList ? placeholderList.length : 0,
    };
    dispatch({
      type: 'smsTemplate/createTemplate',
      payload,
    });
  };
  return (
    <ModalForm
      form={form}
      title={editIndex === -1 ? intl.get('sms.tpl.create') : intl.get('sms.tpl.edit')}
      initialValues={editIndex === -1 ? undefined : dataList[editIndex]}
      visible={dialogVisible}
      confirmLoading={confirmLoading}
      onCancel={hideModal}
      onOk={createTemplate}
    >
      <Form.Item
        label={intl.get('sms.tpl.name')}
        name="templateName"
        rules={[{ validator: validateEmptyContent.bind(null, intl.get('sms.tpl.no.name')) }]}
      >
        <Input type="text" placeholder={intl.get('sms.tpl.edit.name')} />
      </Form.Item>
      <Form.Item label={intl.get('sms.tpl.content')} name="content" rules={[{ validator: validateSMSContent }]}>
        <Input.TextArea placeholder={intl.get('sms.tpl.edit.content')} autoSize={{ minRows: 2 }} />
      </Form.Item>
      <Form.Item label={intl.get('sms.tpl.type')} name="kind" rules={[{ required: true, message: intl.get('sms.tpl.no.type') }]}>
        <Select placeholder={intl.get('sms.tpl.select.type')}>
          {kinds
            .filter((value) => value !== 0)
            .map((value, index) => (
              <Select.Option key={`kind-${index}`} value={index + 1}>
                {intl.get(TemplateKindEnum[value])}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    </ModalForm>
  );
};

export default CreateTemplate;
