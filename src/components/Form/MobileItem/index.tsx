import React, { useState } from 'react';
// import intl from 'react-intl-universal';
import { Form, Input, Select } from 'antd';
import areaCode from '@/config/areaCode';
import './index.less';

interface MobileType {
  areaName: string;
  mobileName: string;
}

const MobileItem: React.FC<MobileType> = ({ areaName, mobileName }) => {
  const [area, setArea] = useState(areaCode[0].code);

  return (
    <Input.Group compact className="mobile-view">
      <Form.Item className="mobile-area" name={areaName} getValueFromEvent={() => area}>
        <Select
          onSelect={(e) => {
            console.log(e);
            setArea(areaCode[e].code);
          }}
          size="large"
          virtual={false}
          value={area}
          defaultActiveFirstOption={true}
          dropdownMatchSelectWidth={318}
          style={{ width: 88 }}
        >
          {areaCode.map((item, index) => (
            <Select.Option value={index} key={index}>
              <span>{item.zh}</span> {item.code}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name={mobileName} className="mobile-input" rules={[{ required: true, message: '请输入用户名!' }]}>
        <Input type="text" size="large" placeholder="手机号" />
      </Form.Item>
    </Input.Group>
  );
};

export default MobileItem;
