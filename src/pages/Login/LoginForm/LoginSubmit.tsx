import { Button, Form } from 'antd';

import { ButtonProps } from 'antd/es/button';
import React from 'react';
import './index.less';

const FormItem = Form.Item;

const LoginSubmit: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <FormItem>
      <Button size="large" className="submit" type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
