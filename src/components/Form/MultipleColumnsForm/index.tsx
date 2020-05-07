import React, { useState, useRef } from 'react';
import intl from 'react-intl-universal';
import { Input, Form } from 'antd';
import './index.less';

interface FieldItem {
  key: string;
  value: string;
}

const MultipleColumnsForm = () => {
  const [fields, setFields] = useState<FieldItem[]>([{ key: '', value: '' }]);
  const fieldsSync = useRef<FieldItem[]>([{ key: '', value: '' }]);

  const deletField = (index: number) => {
    fields.splice(index, 1);
    fieldsSync.current = [...fields];
    setFields([...fields]);
  };
  const addField = () => {
    fields.push({ key: '', value: '' });
    fieldsSync.current = [...fields];
    setFields([...fields]);
  };

  const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    fields[index].key = e.target.value;
    fieldsSync.current = [...fields];
    setFields([...fields]);
  };
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    fields[index].value = e.target.value;
    fieldsSync.current = [...fields];
    setFields([...fields]);
  };

  const sdsd = (rule: any, value: string) => {
    console.log(value);
    let msg = '';
    if (!value) {
      msg = 'Key不能为空！';
    } else {
      const keys = fields.map((item) => item.key);
      const keysSync = fieldsSync.current.map((item) => item.key);
      console.log(keys, keysSync, fieldsSync[0].key);
      if (keys.indexOf(value) !== keys.lastIndexOf(value)) {
        msg = '不能有相同的Key！';
      }
    }
    return msg ? Promise.reject(msg) : Promise.reject();
  };

  return (
    <div className="multiple-columns-form">
      {fields.map((item, index) => (
        <div className="form-item" key={`item-${index}`}>
          <Form.Item className="key" rules={[{ validator: sdsd }]} name={`key-${index}`}>
            <Input placeholder="Key" value={item.key} onChange={(e) => onKeyChange(e, index)} />
          </Form.Item>
          <Form.Item className="value" name={`value-${index}`}>
            <Input placeholder="Value" value={item.value} onChange={(e) => onValueChange(e, index)} />
          </Form.Item>
          {fields.length > 1 && <span onClick={() => deletField(index)}>{intl.get('delete')}</span>}
        </div>
      ))}

      <span className="add" onClick={addField}>
        {intl.get('add')}
      </span>
    </div>
  );
};

export default MultipleColumnsForm;
