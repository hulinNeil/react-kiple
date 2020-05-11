import React, { useState, useEffect } from 'react';
// import intl from 'react-intl-universal';
import { Form, Input, Row, Col, Button } from 'antd';
import { validateEmptyContent } from '@/utils/validateForm';

interface CaptchaType {
  countDown?: number;
  isTiming: boolean;
  size?: 'large' | 'middle' | 'small';
  label?: string;
  name: string;
  validateField: string;
  onGetCaptcha: (e: { [key: string]: string }) => any;
  onTimeout: () => any;
}

const CaptchaItem: React.FC<CaptchaType> = ({ countDown, validateField, onGetCaptcha, onTimeout, isTiming, size, label, name }) => {
  const [count, setCount] = useState<number>(countDown || 120);
  const [timing, setTiming] = useState(isTiming);
  useEffect(() => {
    setTiming(isTiming);
  }, [isTiming]);

  // Change the valid time of the captcha(改变验证码的有效时间)
  useEffect(() => {
    let interval: any;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            onTimeout && onTimeout();
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

  return (
    <Form.Item label={label} required={label ? true : false} shouldUpdate style={{ marginBottom: 0 }}>
      {({ validateFields }) => (
        <Row gutter={8}>
          <Col span={15}>
            <Form.Item name={name} rules={[{ validator: validateEmptyContent.bind(null, '验证码不能为空') }]}>
              <Input type="text" size={size} placeholder="请输入验证码" />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Button
              size={size}
              disabled={timing}
              style={{ display: 'block', width: '100%' }}
              onClick={() => {
                if (validateField) {
                  validateFields([validateField]).then((e) => {
                    onGetCaptcha && onGetCaptcha(e);
                  });
                }
              }}
            >
              {timing ? `${count} 秒` : '获取验证码'}
            </Button>
          </Col>
        </Row>
      )}
    </Form.Item>
  );
};

export default CaptchaItem;
