import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { Input } from 'antd';
import './index.less';

interface FieldItem {
  key: string;
  value: string;
  keyIsValid: boolean;
  valueIsValid: boolean;
}

interface McForm {
  isValid: boolean;
  setValid: React.Dispatch<React.SetStateAction<boolean>>;
  fields: FieldItem[];
  setFields: React.Dispatch<React.SetStateAction<FieldItem[]>>;
  getFields: () => {
    [key: string]: string;
  } | null;
}

// check whether the value of the input is valid
const validForm = (fields: FieldItem[], isValid: boolean, setValid: React.Dispatch<React.SetStateAction<boolean>>) => {
  const keys = fields.map((item) => item.key);
  fields.forEach((item) => {
    if (item.key === '' || keys.indexOf(item.key) !== keys.lastIndexOf(item.key)) {
      item.keyIsValid = false;
    } else {
      item.keyIsValid = true;
    }
    if (item.value === '') {
      item.valueIsValid = false;
    } else {
      item.valueIsValid = true;
    }
  });
  let isValidSync = true;
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i].keyIsValid || !fields[i].valueIsValid) {
      isValidSync = false;
      break;
    }
  }
  if (isValidSync !== isValid) {
    setValid(isValidSync);
  }

  return isValidSync;
};

const initFieldItem = { key: '', value: '', valueIsValid: true, keyIsValid: true };

// export component state
const useMcForm = (): McForm => {
  const [isValid, setValid] = useState(true);
  const [fields, setFields] = useState<FieldItem[]>([JSON.parse(JSON.stringify(initFieldItem))]);
  const getFields = () => {
    if (!isValid || !validForm(fields, isValid, setValid)) {
      return null;
    }
    const result = {};
    fields.forEach((item) => {
      result[item.key] = item.value;
    });
    return result;
  };
  return { isValid, setValid, fields, setFields, getFields };
};

export { useMcForm };

const MultipleColumnsForm: React.FC<{ form: McForm }> = ({ form }) => {
  const { isValid, setValid, fields, setFields }: McForm = form;

  // Every time the data changes, check that the data is valid
  // 每次数据更改时，检查数据是否有效
  const deletField = (index: number) => {
    fields.splice(index, 1);
    validForm(fields, isValid, setValid);
    setFields([...fields]);
  };
  const addField = () => {
    if (!validForm(fields, isValid, setValid)) {
      return;
    }
    fields.push(JSON.parse(JSON.stringify(initFieldItem)));
    setFields([...fields]);
  };
  const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    fields[index].key = value;
    validForm(fields, isValid, setValid);
    setFields([...fields]);
  };
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    fields[index].value = e.target.value;
    validForm(fields, isValid, setValid);
    setFields([...fields]);
  };

  return (
    <div className="multiple-columns-form">
      {fields.map((item, index) => (
        <div className="form-item" key={`item-${index}`}>
          <Input className={`key ${item.keyIsValid ? '' : 'error'}`} placeholder="Key" value={item.key} onChange={(e) => onKeyChange(e, index)} />
          <Input
            className={`value ${item.valueIsValid ? '' : 'error'}`}
            placeholder="Value"
            value={item.value}
            onChange={(e) => onValueChange(e, index)}
          />
          {fields.length > 1 && <span onClick={() => deletField(index)}>{intl.get('delete')}</span>}
        </div>
      ))}
      <span className="add" onClick={addField}>
        {intl.get('add')}
      </span>
      {!isValid && <span className="extra">({intl.get('push.msg.error.fields')}key-value)</span>}
    </div>
  );
};

export default MultipleColumnsForm;
