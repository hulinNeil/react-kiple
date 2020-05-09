import React from 'react';
import intl from 'react-intl-universal';
import { useDispatch, Dispatch, useSelector } from 'dva';
import { Form, Select, Input } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import { PushTopicCreateParamsType } from '@/services/push/topic';
import { PushTopicState } from '@/models/push/topic';
import { validateVersionContent, validateAppName, validateEmptyContent } from '@/utils/validateForm';

const osList = [intl.get('all'), 'Android', 'iOS'];
interface FormValue {
  name: string;
  describe: string;
  os: number; // android,ios,all('')
  osVersion: string; // 8.0
  appVersion: string; // 1.0.2
  appName: string;
}

const CreatePushTopic = () => {
  const dialogVisible = useSelector((state: { pushTopic: PushTopicState }) => state.pushTopic.dialogVisible);
  const confirmLoading = useSelector((state: { pushTopic: PushTopicState }) => state.pushTopic.confirmLoading);
  const osIndex = useSelector((state: { pushTopic: PushTopicState }) => state.pushTopic.osIndex);
  const dispatch = useDispatch<Dispatch>();

  // hide current component
  const hideModal = () => {
    dispatch({
      type: 'pushTopic/change',
      payload: {
        dialogVisible: false,
        confirmLoading: false,
      },
    });
  };

  // crete push topic
  const createTopic = (item: FormValue) => {
    const { name, describe, os, appVersion, osVersion, appName } = item;
    const payload: PushTopicCreateParamsType = {
      name,
      describe: describe || '',
      os: os ? osList[os] : '',
      appVersion: appVersion ? Number(appVersion) : 0,
      osVersion: appVersion ? Number(osVersion) : 0,
      appName: appName || '',
    };
    console.log(os, payload);
    dispatch({
      type: 'pushTopic/createTopic',
      payload,
    });
  };

  const onOSChange = (e: number) => {
    dispatch({
      type: 'pushTopic/change',
      payload: {
        osIndex: e,
      },
    });
  };

  return (
    <ModalForm
      initialValues={{ os: 0 }}
      title={intl.get('push.topic.create')}
      visible={dialogVisible}
      confirmLoading={confirmLoading}
      onCancel={hideModal}
      onOk={createTopic}
    >
      <Form.Item
        label={intl.get('push.topic.name')}
        name="name"
        rules={[{ validator: validateEmptyContent.bind(null, intl.get('push.topic.no.name')) }]}
      >
        <Input type="text" placeholder={intl.get('push.topic.edit.name')} />
      </Form.Item>
      <Form.Item label={intl.get('push.topic.describe')} name="describe">
        <Input type="text" placeholder={intl.get('push.topic.edit.describe')} />
      </Form.Item>
      <Form.Item label={intl.get('push.topic.os')} name="os">
        <Select onChange={onOSChange}>
          {osList.map((item, index) => (
            <Select.Option key={`os-${index}`} value={index}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {osIndex !== 0 && (
        <Form.Item label={intl.get('push.topic.osVersion')} name="osVersion" rules={[{ validator: validateVersionContent }]}>
          <Input placeholder={intl.get('push.topic.edit.osVersion')} />
        </Form.Item>
      )}
      <Form.Item label={intl.get('push.topic.appVersion')} name="appVersion" rules={[{ validator: validateVersionContent }]}>
        <Input placeholder={intl.get('push.topic.edit.appVersion')} />
      </Form.Item>
      <Form.Item label={intl.get('push.topic.appName')} name="appName" rules={[{ validator: validateAppName }]}>
        <Input placeholder={intl.get('push.topic.edit.appName') + '(1-20)'} />
      </Form.Item>
    </ModalForm>
  );
};

export default CreatePushTopic;
