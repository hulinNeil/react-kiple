import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { useSelector, useDispatch, Dispatch } from 'dva';
import { Card, Form, Input, Button, Select, Switch, DatePicker } from 'antd';
import Page from '@/components/Page';
import MultipleColumnsForm, { useMcForm } from '@/components/Form/MultipleColumnsForm';
import { defaultPlaceholderImage } from '@/config';
import { PushCronjobState } from '@/models/push/cronjob';
import { PushCreateParamsType } from '@/services/push/cronjob';
import './index.less';
import { validatePushContentLength } from '@/utils/validateForm';

interface ImgStatus {
  help: string;
  validateStatus: '' | 'error' | 'success' | 'warning' | 'validating' | undefined;
}

const Create: React.FC<{}> = () => {
  const confirmLoading = useSelector((state: { pushCronjob: PushCronjobState }) => state.pushCronjob.confirmLoading);
  const topicListData = useSelector((state: { pushCronjob: PushCronjobState }) => state.pushCronjob.topicListData);
  const [isShowFields, setShowFields] = useState(false);
  const [imgStatus, setImgStatus] = useState<ImgStatus>({ help: ' ', validateStatus: '' });
  const [previewImg, setPreviewImg] = useState(defaultPlaceholderImage);
  const [title, setTitle] = useState('Notification Title');
  const [content, setContent] = useState('Notification Text');
  const mcForm = useMcForm();

  const dispatch = useDispatch<Dispatch>();
  const { topicList, topicLoading, current, total } = topicListData;

  const getTopicList = () => {
    dispatch({
      type: 'pushCronjob/getTopicList',
    });
  };

  // create push
  const createPush = (e: any) => {
    let body;
    if (isShowFields) {
      body = mcForm.getFields(); // 获取fields同时进行校验(Get fields and validate it)
      if (!body) {
        return;
      }
    }
    const payload: PushCreateParamsType = {
      topic: topicList[e.topic].id,
      title: e.title,
      content: e.content,
      body: isShowFields && body ? body : '{}',
      picUrl: '',
      sendTime: Number(e.sendTime.format('x')),
    };

    dispatch({
      type: 'pushCronjob/createCronjob',
      payload,
    });
  };

  // get more topic on select scroll
  const onPopupScroll = () => {
    const view = document.querySelector('.mail-tpl-select>div:last-child');
    if (view) {
      const contentH = view.clientHeight;
      const viewH = view.scrollHeight;
      const scrollTop = view.scrollTop;
      if (contentH - viewH - scrollTop <= 100 && !topicLoading && (current - 1) * 10 < total) {
        getTopicList();
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
      if (value.length > 1000) {
        setImgStatus({ help: intl.get('push.max.len', { length: 1000 }), validateStatus: 'error' });
        return;
      }
      if (value) {
        setPreviewImg(value);
      }
      setImgStatus({ help: ' ', validateStatus: '' });
    }
    if (!value && previewImg !== defaultPlaceholderImage) {
      setPreviewImg(defaultPlaceholderImage);
    }
  };

  // if the image url is incorrect, it needs to be displayed in the form item
  const onImgError = () => {
    if (previewImg !== defaultPlaceholderImage) {
      setImgStatus({ help: intl.get('push.msg.file.error.img'), validateStatus: 'error' });
    }
  };

  // get push topic list
  useEffect(() => {
    if (topicList.length === 0) {
      getTopicList();
    }
    return () => {
      console.log('改变isShouldRefresh');
      dispatch({
        type: 'pushCronjob/change',
        payload: { isShouldRefresh: true },
      });
    };
  }, []);

  return (
    <Page title={intl.get('push.record.create')} showArrow={true}>
      <Card className="push-create">
        <Form labelCol={{ span: 5 }} onFinish={createPush} onFinishFailed={() => isShowFields && mcForm.getFields()}>
          <div className="push-editor">
            {/* 输入任务相关数据(Enter task-related data) */}
            <div className="push-editor-form">
              <Form.Item label={intl.get('push.msg.title')} name="title" rules={[{ validator: validatePushContentLength.bind(null, 20) }]}>
                <Input type="text" placeholder={intl.get('push.msg.title') + '(1-20)'} onChange={onTitleChange} />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.content')} name="content" rules={[{ validator: validatePushContentLength.bind(null, 200) }]}>
                <Input.TextArea placeholder={intl.get('push.msg.edit.content') + '(1-200)'} onChange={onContentChange} autoSize={{ minRows: 2 }} />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.img')} name="image" help={imgStatus.help} validateStatus={imgStatus.validateStatus}>
                <Input placeholder={intl.get('push.msg.edit.img') + ': https://yourapp.com/image.png'} onChange={onImageChange} />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.to')} name="topic" rules={[{ required: true, message: intl.get('sms.tpl.no.name') }]}>
                <Select
                  dropdownRender={(menu) => <div className="mail-tpl-select">{menu}</div>}
                  notFoundContent={intl.get('push.msg.no.to')}
                  placeholder={intl.get('push.msg.select.to')}
                  loading={topicLoading}
                  onPopupScroll={onPopupScroll}
                >
                  {topicList.map((value, index) => (
                    <Select.Option key={`tpl-${index}`} value={index}>
                      {value.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={intl.get('sms.send.time')} name="sendTime" rules={[{ required: true, message: intl.get('sms.send.no.time') }]}>
                <DatePicker
                  placeholder={intl.get('sms.send.select.time')}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={(current) => current && current < moment()}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              </Form.Item>
              <Form.Item label={intl.get('push.msg.fields')}>
                <div className="field-switch">
                  <Switch checked={isShowFields} onChange={(e) => setShowFields(e)} />
                </div>
                {isShowFields && <MultipleColumnsForm form={mcForm}></MultipleColumnsForm>}
              </Form.Item>
            </div>
            {/* 预览输入的数据(Preview the input data) */}
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
