import React, { useState, useImperativeHandle, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Form, Input, message } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import CaptchaItem from '@/components/Form/CaptchaItem';
import MobileItem from '@/components/Form/MobileItem';
import './index.less';

interface Type {
  type: 'tel' | 'email';
  operate: 'reset' | 'add';
}

const countDown = 120;

// reset mobile or email
const ResetContact = ({ cRef }: { cRef: any }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [count, setCount] = useState<number>(countDown);
  const [timing, setTiming] = useState(false);
  const [type, setType] = useState<Type>({
    type: 'tel',
    operate: 'reset',
  });

  const onGetCaptcha = (e: any) => {
    console.log('联系方式', e.contact);
    message.success('获取验证码成功！验证码为：1234');
    setTiming(true);
  };
  // Change the valid time of the captcha(改变验证码的有效时间)
  useEffect(() => {
    let interval: any;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval);
            // reset time
            return countDown || 120;
          }
          return preSecond - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timing]);

  // hide modal and reset state
  const hideRestContact = () => {
    setDialogVisible(false);
    if (confirmLoading) {
      setConfirmLoading(false);
    }
    if (timing) {
      setTiming(false);
    }
    if (count !== countDown) {
      setCount(countDown);
    }
  };
  const showRestContact = (parameter: Type) => {
    setType({ ...type, ...parameter });
    setDialogVisible(true);
  };
  const onOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      hideRestContact();
      setConfirmLoading(false);
    }, 2000);
  };

  useImperativeHandle(cRef, () => ({
    hideRestContact,
    showRestContact,
  }));

  const validateContact = (rule: any, value: string) => {
    let msg = '';
    value = value ? value.trim() : '';
    if (!value) {
      msg = intl.get('push.len.empty');
    } else {
      const reg = type.type === 'email' ? /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i : /^\d{4,14}$/i;
      if (!reg.test(value)) {
        msg = type.type === 'tel' ? intl.get('sms.send.error.to') : intl.get('mail.send.error.to');
      }
    }
    return msg ? Promise.reject(msg) : Promise.reject();
  };

  const title = `${type.operate === 'add' ? intl.get('add') : intl.get('reset')}${type.type === 'tel' ? intl.get('tel') : intl.get('email')}`;

  return (
    <ModalForm
      title={title}
      initialValues={{ area: '+60' }}
      visible={dialogVisible}
      confirmLoading={confirmLoading}
      onCancel={hideRestContact}
      onOk={onOk}
    >
      {type.type === 'tel' ? (
        <MobileItem areaName="area" mobileName="contact" label={intl.get('tel')} />
      ) : (
        <Form.Item label={intl.get('email')} name="contact" required={true} rules={[{ validator: validateContact }]}>
          <Input type="text" placeholder={intl.get('email.edit')} />
        </Form.Item>
      )}

      <CaptchaItem
        isTiming={timing}
        name="captcha"
        label={intl.get('cap')}
        countDown={3}
        validateField="contact"
        onTimeout={() => {
          setTimeout(() => {
            setTiming(false);
          }, 0);
        }}
        onGetCaptcha={onGetCaptcha}
      />
    </ModalForm>
  );
};

export default ResetContact;
