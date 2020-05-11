import React from 'react';
import { router, Dispatch, useSelector, useDispatch } from 'dva';
import { Button, Form, Input } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models';
import '../index.less';

const { Link } = router;

const RetrievePwd: React.FC<{}> = () => {
  const { submitting, isAccount } = useSelector((state: ConnectState) => state.user);
  const dispatch = useDispatch<Dispatch>();

  const handleSubmit = (values: any) => {
    console.log(values);
    dispatch({
      type: 'user/login',
      payload: { ...values, isAccount },
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
        <span className="title">找回密码</span>
      </div>
      <Form onFinish={handleSubmit} className="login-form">
        {isAccount ? (
          <Form.Item name="userName" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input type="text" size="large" placeholder="帐号绑定的邮箱" prefix={<MailOutlined />} />
          </Form.Item>
        ) : (
          <Form.Item name="userName" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input type="text" size="large" placeholder="帐号绑定的手机号" prefix={<UserOutlined />} />
          </Form.Item>
        )}

        <Button htmlType="submit" loading={submitting} className="submit" size="large" type="primary">
          下一步
        </Button>
        <div className="form-row" style={{ marginTop: 30 }}>
          <a onClick={changeLoginType}>{isAccount ? '通过手机找回' : '通过邮箱找回'}</a>
          <span className="login-foot-span"></span>
          <Link to="/login">重新登录</Link>
        </div>
      </Form>
    </div>
  );
};

export default RetrievePwd;
