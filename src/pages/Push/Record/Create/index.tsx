import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch, Dispatch } from 'dva';
import moment from 'moment';
import { Card, Form, Input, Button, Select, Switch, DatePicker } from 'antd';
import { PushRecordState } from '@/models/push/record';
import Page from '@/components/Page';
import MultipleColumnsForm from '@/components/Form/MultipleColumnsForm';
import './index.less';

interface ImgStatus {
  help: string;
  validateStatus: '' | 'error' | 'success' | 'warning' | 'validating' | undefined;
}

const defaultImgUrl = 'https://www.gstatic.com/mobilesdk/180130_mobilesdk/images/image_placeholder.png';

const Create: React.FC<{}> = () => {
  const confirmLoading = useSelector((state: { pushRecord: PushRecordState }) => state.pushRecord.confirmLoading);
  const themeListData = useSelector((state: { pushRecord: PushRecordState }) => state.pushRecord.themeListData);
  const [isShowFields, setShowFields] = useState(false);
  const [imgStatus, setImgStatus] = useState<ImgStatus>({ help: ' ', validateStatus: '' });
  const [previewImg, setPreviewImg] = useState(defaultImgUrl);
  const [title, setTitle] = useState('Notification Title');
  const [content, setContent] = useState('Notification Text');

  const dispatch = useDispatch<Dispatch>();
  const { themeList, themeLoading, current, total } = themeListData;

  const getThemeList = () => {
    dispatch({
      type: 'pushRecord/getThemeList',
    });
  };

  // create or edit push
  const createPush = async (e: any): Promise<void> => {
    console.log('创建push', e);
  };

  // get more theme on select scroll
  const onPopupScroll = () => {
    const view = document.querySelector('.mail-tpl-select>div:last-child');
    if (view) {
      const contentH = view.clientHeight;
      const viewH = view.scrollHeight;
      const scrollTop = view.scrollTop;
      if (contentH - viewH - scrollTop <= 100 && !themeLoading && (current - 1) * 10 < total) {
        getThemeList();
      }
    }
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value ? value : 'Notification Title');
  };

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value ? value : 'Notification Text');
  };

  // monitor the image address for verification and set preview image url
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const reg = /^http(s)?:\/\/.+/i;
    if (value && !reg.test(value)) {
      setImgStatus({ help: intl.get('push.msg.error.img'), validateStatus: 'error' });
    } else {
      if (value) {
        setPreviewImg(value);
      }
      setImgStatus({ help: ' ', validateStatus: '' });
    }
    if (!value && previewImg !== defaultImgUrl) {
      setPreviewImg(defaultImgUrl);
    }
  };

  // if the image url is incorrect, it needs to be displayed in the form item
  const onImgError = () => {
    if (previewImg !== defaultImgUrl) {
      setImgStatus({ help: intl.get('push.msg.file.error.img'), validateStatus: 'error' });
    }
  };

  // get push theme list
  useEffect(() => {
    if (themeList.length === 0) {
      getThemeList();
    }
    return () => {
      dispatch({
        type: 'pushRecord/change',
        payload: { isShouldRefresh: true },
      });
    };
  }, []);

  return (
    <Page title={intl.get('push.record.create')} showArrow={true}>
      <Card className="push-create">
        <Form labelCol={{ span: 5 }} onFinish={createPush}>
          <div className="push-editor">
            <div className="push-editor-form">
              <Form.Item label={intl.get('push.msg.title')} name="title" rules={[{ required: true, message: intl.get('push.msg.no.title') }]}>
                <Input type="text" placeholder={intl.get('push.msg.title')} onChange={onTitleChange} />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.content')} name="content" rules={[{ required: true, message: intl.get('push.msg.no.content') }]}>
                <Input.TextArea placeholder={intl.get('push.msg.edit.content')} onChange={onContentChange} autoSize={{ minRows: 2 }} />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.img')} name="image" help={imgStatus.help} validateStatus={imgStatus.validateStatus}>
                <Input placeholder={intl.get('push.msg.edit.img') + ': https://yourapp.com/image.png'} onChange={onImageChange} />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.to')} name="theme" rules={[{ required: true, message: intl.get('sms.tpl.no.name') }]}>
                <Select
                  dropdownRender={(menu) => <div className="mail-tpl-select">{menu}</div>}
                  notFoundContent={intl.get('sms.send.no.tpl')}
                  loading={themeLoading}
                  onPopupScroll={onPopupScroll}
                >
                  {themeList.map((value, index) => (
                    <Select.Option key={`tpl-${index}`} value={index}>
                      {value.templateName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={intl.get('sms.send.time')} name="sendTime" rules={[{ required: true, message: intl.get('sms.send.no.time') }]}>
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={(current) => current && current < moment()}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.fields')}>
                <div className="field-switch">
                  <Switch checked={isShowFields} onChange={(e) => setShowFields(e)} />
                </div>
                {isShowFields && <MultipleColumnsForm></MultipleColumnsForm>}
              </Form.Item>
            </div>
            <div className="push-preview">
              <div className="push-preview-title">{intl.get('preview')}</div>
              <div className="push-preview-device">
                <div className="content">
                  <div className="text">
                    <div className="title nobr">{title}</div>
                    <div className="text nobr">{content}</div>
                  </div>
                  <img src={previewImg} onError={onImgError} />
                </div>
              </div>
            </div>
          </div>
          <Form.Item className="push-editor-submit">
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
