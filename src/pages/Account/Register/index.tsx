import React, { useState } from 'react';
import { router, Dispatch, useDispatch } from 'dva';
import { Button, Form } from 'antd';
import MobileItem from '@/components/Form/MobileItem';
import '../index.less';
import CaptchaItem from '@/components/Form/CaptchaItem';
import { setTimeout } from 'timers';

const { Link } = router;

const RetrievePwd: React.FC<{}> = () => {
  const [isTiming, setTiming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<Dispatch>();

  const handleSubmit = (values: any) => {
    console.log(values);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };
  const onGetCaptcha = (e: { [key: string]: string }) => {
    console.log(e);
    // setTiming(true);
    dispatch({
      type: 'user/getCaptcha',
      payload: { mobile: e.mobile },
    });
  };

  return (
    <div className="login-main">
      <div className="logo">
        <span className="login-head-span"></span>
        <span className="title">注册</span>
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
          快速注册
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
