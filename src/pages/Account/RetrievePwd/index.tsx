import React, { useState } from 'react';
import { router } from 'dva';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import MobileItem from '@/components/Form/MobileItem';
import CaptchaItem from '@/components/Form/CaptchaItem';
import ConfirmPwdItem from '@/components/Form/ConfirmPwdItem';
import '../index.less';

const { Link } = router;

const RetrievePwd: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [isUseMobile, setIsUseMobile] = useState(true);
  const [isShowCaptcha, setIsShowCaptcha] = useState(false);
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [isTiming, setTiming] = useState(false);

  // 验证账号是否存在
  const checkContact = (value: any) => {
    console.log('check 联系方式是否存在', value);
    setSubmitting(true);
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setTiming(true);
        setIsShowCaptcha(true);
      } else {
        message.error('账号不存在！');
      }
      setSubmitting(false);
    }, 1000);
  };

  // 验证验证码是否相同
  const checkCaptcha = (values: any) => {
    console.log('check 验证码', values);
    setSubmitting(true);
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setTiming(false);
        setIsShowPwd(true);
      } else {
        message.error('验证码不正确！');
      }
      setSubmitting(false);
    }, 1000);
  };

  // 获得验证吗
  const onGetCaptcha = (e) => {
    console.log('get 验证吗', e);
    setTiming(true);
  };

  // 点击按钮，进行验证
  const handleSubmit = (values: any) => {
    console.log(values);
    if (!isShowCaptcha) {
      checkContact(values);
      return;
    }
    if (!isShowPwd) {
      checkCaptcha(values);
      return;
    }
  };

  const changeContactType = () => {
    setIsUseMobile(!isUseMobile);
    setIsShowCaptcha(false);
    setTiming(false);
  };

  return (
    <div className="login-main">
      <div className="logo">
        <span className="login-head-span"></span>
        <span className="title">找回密码</span>
      </div>
      <Form onFinish={handleSubmit} className="login-form" initialValues={{ area: '+60' }}>
        {isUseMobile ? (
          <MobileItem size="large" areaName="area" mobileName="mobile" disabled={isShowCaptcha} />
        ) : (
          <Form.Item name="email" rules={[{ required: true, message: '邮箱不能为空' }]}>
            <Input type="text" size="large" placeholder="帐号绑定的邮箱" prefix={<MailOutlined />} disabled={isShowCaptcha} />
          </Form.Item>
        )}
        {isShowCaptcha && (
          <CaptchaItem
            isTiming={isTiming}
            name="captcha"
            size="large"
            countDown={10}
            disabled={isShowPwd}
            validateField={isUseMobile ? 'mobile' : 'email'}
            onTimeout={() => {
              setTimeout(() => {
                setTiming(false);
              }, 0);
            }}
            onGetCaptcha={onGetCaptcha}
          />
        )}
        {isShowPwd && <ConfirmPwdItem size="large" />}
        <Button htmlType="submit" loading={submitting} className="submit" size="large" type="primary">
          下一步
        </Button>
        <div className="form-row" style={{ marginTop: 30 }}>
          <a onClick={changeContactType}>{!isUseMobile ? '通过手机找回' : '通过邮箱找回'}</a>
          <span className="login-foot-span"></span>
          <Link to="/login">重新登录</Link>
        </div>
      </Form>
    </div>
  );
};

export default RetrievePwd;
