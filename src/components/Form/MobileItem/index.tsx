import React from 'react';
import intl from 'react-intl-universal';
import { Form, Input, Select } from 'antd';
import areaCode from '@/config/areaCode';
import { validateTelContent, validateEmptyContent } from '@/utils/validateForm';
import './index.less';

interface MobileType {
  areaName: string;
  mobileName: string;
  label?: string;
  size?: 'large' | 'middle' | 'small';
}

const MobileItem: React.FC<MobileType> = ({ areaName, mobileName, size, label }) => {
  const currentLocale: string | undefined = intl.getInitOptions().currentLocale;

  return (
    <Form.Item label={label} required={label ? true : false} className="mobile-view">
      <Input.Group compact>
        <Form.Item
          className="mobile-area"
          name={areaName}
          normalize={(e) => areaCode[e].code}
          rules={[{ required: true, message: '请选择手机区号！' }]}
        >
          <Select
            size={size}
            value="12"
            dropdownClassName="area-dropdown"
            optionLabelProp="lable"
            defaultActiveFirstOption={false}
            dropdownMatchSelectWidth={318}
            style={{ width: 88 }}
          >
            {areaCode.map((item, index) => (
              <Select.Option value={index} lable={item.code} key={index}>
                {currentLocale && ~currentLocale.indexOf('zh') ? item.zh : item.us} {item.code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={mobileName}
          className="mobile-input"
          rules={[{ validator: validateEmptyContent.bind(null, '手机号不能为空') }, { validator: validateTelContent }]}
        >
          <Input type="text" size={size} placeholder="手机号" />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
};

export default MobileItem;
