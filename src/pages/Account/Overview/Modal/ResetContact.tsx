import React, { useState, useImperativeHandle, useCallback, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Form, Input, Row, Col, Button, message } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import { validateEmptyContent } from '@/utils/validateForm';
import './index.less';

interface Type {
  type: 'tel' | 'email';
  operate: 'reset' | 'add';
}

const countDown = 120;

// rest tel or email
const ResetContact = ({ cRef }: { cRef: any }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [count, setCount] = useState<number>(countDown);
  const [timing, setTiming] = useState(false);
  const [type, setType] = useState<Type>({
    type: 'tel',
    operate: 'reset',
  });

  const onGetCaptcha = useCallback(async (contact: string) => {
    console.log('联系方式', contact);
    // const result = await getFakeCaptcha(contact);
    // if (!result) {
    //   return;
    // }
    message.success('获取验证码成功！验证码为：1234');
    setTiming(true);
  }, []);

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
        msg = (type.type === 'tel' ? '手机号' : '邮箱') + '格式不正确';
      }
    }
    return msg ? Promise.reject(msg) : Promise.reject();
  };

  const title = `${type.operate === 'add' ? '添加' : '重置'}${type.type === 'tel' ? '手机号' : '邮箱'}`;

  return (
    <ModalForm title={title} visible={dialogVisible} confirmLoading={confirmLoading} onCancel={hideRestContact} onOk={onOk}>
      <Form.Item label={type.type === 'tel' ? '手机号' : '邮箱'} name="contact" required={true} rules={[{ validator: validateContact }]}>
        <Input type="text" placeholder={`请输入${type.type === 'tel' ? '手机号' : '邮箱'}`} />
      </Form.Item>
      <Form.Item label="验证码" required={true} shouldUpdate className="captcha-view">
        {({ validateFields }) => (
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item name="captcha" rules={[{ validator: validateEmptyContent.bind(null, '验证码不能为空') }]}>
                <Input type="text" placeholder="请输入验证码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                disabled={timing}
                className="captcha-button"
                onClick={() => {
                  validateFields(['contact']).then((e) => {
                    onGetCaptcha(e.contact);
                  });
                }}
              >
                {timing ? `${count} 秒` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        )}
      </Form.Item>
    </ModalForm>
  );
};

export default ResetContact;
