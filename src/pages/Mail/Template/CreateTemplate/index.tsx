import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { Card, Form, Input, Button, Select } from 'antd';
import ReactQuill from 'react-quill';
import Page from '@/components/Page';
import { CreateMailParamsType } from '@/services/mail/template';
import { validateMailContent, validateEmptyContent } from '@/utils/validateForm';
import { MailTemplateState } from '@/models/mail/template';
import { TemplateKindEnum } from '@/config/smsMail';
import 'react-quill/dist/quill.snow.css';
import './index.less';

const kinds = [0, 1, 2, 3];
// email content editor titlebar
const editorModules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
  ],
};

const Create: React.FC<{}> = () => {
  const dataList = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.dataList);
  const editIndex = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.editIndex);
  const confirmLoading = useSelector((state: { mailTemplate: MailTemplateState }) => state.mailTemplate.confirmLoading);
  const [form] = Form.useForm();
  const dispatch = useDispatch<Dispatch>();

  // create or edit mail template
  const createTemplate = (e: any) => {
    const { templateName, title, content, buSystem, kind } = e;
    const placeholderList = content.match(/{\d+}/gi);
    const payload: CreateMailParamsType = {
      templateName,
      title,
      content,
      kind,
      buId: 0,
      buSystem,
      rule: 1,
      channel: 1,
      placeholderCount: placeholderList ? placeholderList.length : 0,
    };
    dispatch({
      type: 'mailTemplate/createTemplate',
      payload,
    });
  };

  // set template not refresh
  useEffect(() => {
    return () => {
      dispatch({
        type: 'mailTemplate/change',
        payload: { isShouldRefresh: true },
      });
    };
  }, []);

  // form init values
  const initialValues = editIndex === -1 ? { content: '<p><br></p>' } : dataList[editIndex];

  return (
    <Page title={intl.get('sms.tpl.create')} showArrow={true}>
      <Card className="mail-editor">
        <Form name="mail-editor" form={form} labelCol={{ span: 3 }} onFinish={createTemplate} initialValues={initialValues}>
          <Form.Item
            label={intl.get('sms.tpl.name')}
            name="templateName"
            rules={[{ validator: validateEmptyContent.bind(null, intl.get('sms.tpl.no.name')) }]}
          >
            <Input type="text" placeholder={intl.get('sms.tpl.edit.name')} />
          </Form.Item>
          <Form.Item
            label={intl.get('mail.tpl.title')}
            name="title"
            rules={[{ validator: validateEmptyContent.bind(null, intl.get('mail.tpl.edit.title')) }]}
          >
            <Input placeholder={intl.get('mail.tpl.no.title')} />
          </Form.Item>
          <Form.Item label={intl.get('mail.tpl.type')} name="kind" rules={[{ required: true, message: intl.get('mail.tpl.select.type') }]}>
            <Select placeholder={intl.get('mail.tpl.no.type')}>
              {kinds
                .filter((value) => value !== 0)
                .map((value, index) => (
                  <Select.Option key={`kind-${index}`} value={index + 1}>
                    {intl.get(TemplateKindEnum[value])}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item className="mail-editor-content" label={intl.get('mail.tpl.content')} name="content" rules={[{ validator: validateMailContent }]}>
            <ReactQuill theme="snow" modules={editorModules} placeholder={intl.get('mail.tpl.edit.content')} />
          </Form.Item>
          <Form.Item className="mail-editor-submit">
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              {intl.get('ok')}
            </Button>
            <Button onClick={() => history.back()}>{intl.get('cancel')}</Button>
          </Form.Item>
        </Form>
      </Card>
    </Page>
  );
};

export default Create;
