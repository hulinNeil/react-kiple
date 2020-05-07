import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import intl from 'react-intl-universal';
import { Card, Radio, DatePicker } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import './index.less';

interface DateSearchProps {
  onChange: (e: [Moment, Moment]) => void;
}

const DateSearch: React.FC<DateSearchProps> = ({ onChange }) => {
  const [dateIndex, setDateIndex] = useState(0);
  const [dates, setDates] = useState<[Moment, Moment]>([moment(), moment()]);

  // select date
  const onDateChange = (e: RadioChangeEvent) => {
    const time = e.target.value;
    let endDateUnix: number = moment().unix();
    const startDateUnix: number = endDateUnix - time * 24 * 60 * 60;
    if (time === 1) {
      endDateUnix -= 24 * 60 * 60;
    }
    setDateIndex(time);
    setDates([moment.unix(startDateUnix), moment.unix(endDateUnix)]);
    onChange && onChange([moment.unix(startDateUnix), moment.unix(endDateUnix)]);
  };
  const onCalendarChange = (e: any) => {
    setDateIndex(-1);
    setDates(e);
    onChange && onChange(e);
  };
  return (
    <Card className="date-search-card">
      <Radio.Group className="date-search-card-select" onChange={onDateChange} value={dateIndex}>
        <Radio.Button value={0}>{intl.get('sms.history.toady')}</Radio.Button>
        <Radio.Button value={1}>{intl.get('sms.history.yesterday')}</Radio.Button>
        <Radio.Button value={7}>{intl.get('sms.history.week')}</Radio.Button>
        <Radio.Button value={30}>{intl.get('sms.history.month')}</Radio.Button>
      </Radio.Group>
      <DatePicker.RangePicker onChange={onCalendarChange} value={dates} format="YYYY-MM-DD" allowClear={false} />
    </Card>
  );
};

export default DateSearch;
