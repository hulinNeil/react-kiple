import React, { useEffect } from 'react';
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
  const businessData = useSelector((state: { smsTemplate: SmsTemplateState }) => state.smsTemplate.businessData);
  const dispatch = useDispatch<Dispatch>();
  const [form] = Form.useForm();

  // set system value when select sms business
  const onBusinessSelectChange = (e: string) => {
    const index = businessData.rawData.findIndex((item) => item.buKind === e);
    dispatch({
      type: 'smsTemplate/change',
      payload: {
        businessData: { ...businessData, curIndex: index },
      },
    });
    const fields = form.getFieldsValue();
    fields.buSystem = businessData.rawData[index].children[0];
    form.setFieldsValue(fields);
  };

  // get sms business-system list
  useEffect(() => {
    if (dialogVisible && !businessData.isLoadedData) {
      dispatch({
        type: 'smsTemplate/getBusinessData',
      });
    }
  }, [dialogVisible]);

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
    const { templateName, content, buKind, buSystem, kind } = item;
    const buItem = businessData.rawData.find((e) => e.buKind === buKind);
    const placeholderList = content.match(/{\d+}/gi);
    const payload: CreateTemplateParamsType = {
      templateName,
      content,
      kind,
      buId: buItem && buItem.buId ? buItem.buId : 0,
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
      <Form.Item label={intl.get('sms.tpl.business')} required={true} className="business-view">
        <Form.Item name="buKind" rules={[{ required: true, message: intl.get('sms.tpl.no.business') }]}>
          <Select placeholder={intl.get('sms.tpl.select.business')} loading={businessData.isLoading} onChange={onBusinessSelectChange}>
            {businessData.rawData.map((value, index) => (
              <Select.Option key={`bus-${index}`} value={value.buKind}>
                {value.buKind}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="buSystem" rules={[{ required: true, message: intl.get('sms.tpl.no.system') }]}>
          <Select placeholder={intl.get('sms.tpl.select.system')} loading={businessData.isLoading}>
            {businessData.rawData[businessData.curIndex] &&
              businessData.rawData[businessData.curIndex].children.map((value, index) => (
                <Select.Option key={`bus-${index}`} value={value}>
                  {value}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form.Item>
    </ModalForm>
  );
};

export default CreateTemplate;
