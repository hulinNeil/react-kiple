import React from 'react';
import { Button, Form } from 'antd';
import './index.less';

interface CartTitleFormProps {
  title: string;
  onLeftClick?: () => void;
  onFinish?: (e: any) => void;
  initialValues?: any;
}

const CartTitleForm: React.FC<CartTitleFormProps> = (props) => {
  const { title, onLeftClick, onFinish, initialValues, children } = props;
  return (
    <div className="card-title-form">
      {title && (
        <div className="card-title-form-left">
          <Button type="primary" onClick={onLeftClick && onLeftClick}>
            {title}
          </Button>
        </div>
      )}
      {children && (
        <Form className="card-title-form-right" name="card-form" onFinish={onFinish && onFinish} initialValues={initialValues}>
          {React.Children.map(children, (item) => item)}
        </Form>
      )}
    </div>
  );
};

export default CartTitleForm;
