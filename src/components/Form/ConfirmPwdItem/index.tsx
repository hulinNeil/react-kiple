import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { Form, Input, Tooltip } from 'antd';
import { validatePassword } from '@/utils/validateForm';

// comfirm password form-item
interface ConfirmPwdType {
  lable?: string;
  placeholder?: string;
  size?: 'large' | 'middle' | 'small';
  name?: string;
}

const ConfirmPwdItem: React.FC<ConfirmPwdType> = ({ size, lable, name, placeholder }) => {
  const [isShowPwdTip, setIsShowPwdTip] = useState(false);
  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setIsShowPwdTip(true);
    } else {
      setIsShowPwdTip(false);
    }
  };

  return (
    <>
      <Tooltip placement="rightTop" title={intl.get('pwd.rule')} visible={isShowPwdTip}>
        <Form.Item name={name ? name : 'password'} label={lable} required={true} rules={[{ validator: validatePassword }]}>
          <Input
            type="password"
            autoComplete="off"
            size={size}
            placeholder={placeholder ? placeholder : intl.get('pwd.edit', { type: intl.get('new') })}
            onChange={onInputFocus}
            onFocus={onInputFocus}
            onBlur={() => setIsShowPwdTip(false)}
          />
        </Form.Item>
      </Tooltip>
      <Form.Item
        name={name ? `${name}-confirm` : 'password-confirm'}
        label={lable && intl.get('pwd.confirm.lable')}
        required={true}
        dependencies={[name ? name : 'password']}
        rules={[
          {
            required: true,
            message: intl.get('push.len.empty'),
          },
          ({ getFieldsValue, getFieldValue }) => ({
            validator(rule, value) {
              console.log(getFieldValue(name || 'password'), value, getFieldsValue());
              if (!value || getFieldValue(name || 'password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(intl.get('pwd.confirm.error'));
            },
          }),
        ]}
      >
        <Input type="password" size={size} placeholder={intl.get('pwd.confirm.edit')} />
      </Form.Item>
    </>
  );
};

export default ConfirmPwdItem;
