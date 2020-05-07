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
  const [disabled, setDisabled] = useState(true);

  const deletField = (index: number) => {
    fields.splice(index, 1);
    setFields([...fields]);
  };
  const addField = () => {
    fields.push({ key: '', value: '' });
    setFields([...fields]);
  };

  const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    fields[index].key = e.target.value;
    setFields([...fields]);
  };
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    fields[index].value = e.target.value;
    setFields([...fields]);
  };

  return (
    <div className="multiple-columns-form">
      {fields.map((item, index) => (
        <div className="form-item" key={`item-${index}`}>
          <Input className="key" autoFocus placeholder="Key" value={item.key} onChange={(e) => onKeyChange(e, index)} />
          <Input className="value" placeholder="Value" value={item.value} onChange={(e) => onValueChange(e, index)} />
          {fields.length > 1 && <span onClick={() => deletField(index)}>{intl.get('delete')}</span>}
        </div>
      ))}
      <span className={`add ${disabled ? 'disabled' : ''}`} onClick={addField}>
        {intl.get('add')}
      </span>
    </div>
  );
};

export default MultipleColumnsForm;
