import React, { useState } from 'react';
import { router, Dispatch, useSelector, useDispatch } from 'dva';
import { Button, Form, Input } from 'antd';
import CaptchaItem from '@/components/Form/CaptchaItem';
import MobileItem from '@/components/Form/MobileItem';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models';
import '../index.less';

const { Link } = router;

const Login: React.FC<{}> = () => {
  const [isTiming, setTiming] = useState(false);
  const { submitting, isAccount } = useSelector((state: ConnectState) => state.user);
  const dispatch = useDispatch<Dispatch>();

  const handleSubmit = (values: any) => {
    console.log(values);
    dispatch({
      type: 'user/login',
      payload: { ...values, isAccount },
    });
  };

  const onGetCaptcha = (e: { [key: string]: string }) => {
    console.log(e);
    setTiming(true);
    dispatch({
      type: 'user/getCaptcha',
      payload: { mobile: e.mobile },
    });
  };

  // change login type: mobile or account
  const changeLoginType = () => {
    dispatch({
      type: 'user/change',
      payload: { isAccount: !isAccount },
    });
  };

  return (
    <div className="login-main">
      <div className="logo">
        <span className="login-head-span"></span>
        <span className="title">用户登陆</span>
      </div>
      <Form onFinish={handleSubmit} className="login-form">
        {isAccount ? (
          <>
            <Form.Item name="userName" rules={[{ required: true, message: '请输入用户名!' }]}>
              <Input type="text" size="large" placeholder="用户名/手机号/邮箱" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password type="password" size="large" placeholder="用户名/手机号/邮箱" prefix={<LockOutlined />} />
            </Form.Item>
          </>
        ) : (
          <>
            <MobileItem areaName="area" mobileName="mobile" />
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
          </>
        )}

        <Button htmlType="submit" loading={submitting} className="submit" size="large" type="primary">
          登录
        </Button>
        <div className="form-row">
          <a onClick={changeLoginType}>{isAccount ? '免密登录' : '密码登录'}</a>
          <span className="login-foot-span"></span>
          <Link to="/password_reset">忘记密码</Link>
          <span className="login-foot-span"></span>
          <Link to="/user/register">注册账户</Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
