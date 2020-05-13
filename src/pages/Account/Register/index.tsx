import React, { useState } from 'react';
import { router } from 'dva';
import { Button, Form, Steps } from 'antd';
import MobileItem from '@/components/Form/MobileItem';
import CaptchaItem from '@/components/Form/CaptchaItem';
import '../index.less';

const { Link } = router;

const RetrievePwd: React.FC<{}> = () => {
  const [isTiming, setTiming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (values: any) => {
    console.log(values);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };
  const onGetCaptcha = (e: { [key: string]: string }) => {
    console.log(e, '获取验证码');
  };

  return (
    <div className="login-main">
      <div className="logo">
        <span className="login-head-span"></span>
        <span className="title">注册</span>
      </div>
      <div>
        <Steps size="small" labelPlacement="vertical">
          <Steps.Step key={1} title="创建账户" />
          <Steps.Step key={2} title="设置身份信息" />
          <Steps.Step key={3} title="成功" />
        </Steps>
      </div>
      <Form onFinish={handleSubmit} className="login-form" initialValues={{ area: '+60' }}>
        <MobileItem size="large" areaName="area" mobileName="mobile" />
        <CaptchaItem
          isTiming={isTiming}
          name="captcha"
          size="large"
          countDown={3}
          validateField="mobile"
          onTimeout={() => {
            setTimeout(() => {
              setTiming(false);
            }, 0);
          }}
          onGetCaptcha={onGetCaptcha}
        />
        <Button htmlType="submit" loading={submitting} className="submit" size="large" type="primary">
          下一步
        </Button>
        <div className="form-row" style={{ marginTop: 30 }}>
          <Link to="/login">直接登录</Link>
          <span className="login-foot-span"></span>
          <Link to="/password_reset">忘记密码</Link>
        </div>
      </Form>
    </div>
  );
};

export default RetrievePwd;
