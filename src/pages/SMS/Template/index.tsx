import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Dispatch, useDispatch } from 'dva';
import Page from '@/components/Page';
import CreateTemplate from './CreateTemplate';
import TemplateList from './TemplateList';
import './index.less';

const Template: React.FC<{}> = () => {
  const dispatch = useDispatch<Dispatch>();

  // reset redux data when component destroyed
  useEffect(() => {
    return () => {
      dispatch({
        type: 'smsTemplate/reset',
      });
    };
  }, []);

  return (
    <Page title={intl.get('sms.tpl.title')}>
      <TemplateList />
      <CreateTemplate />
    </Page>
  );
};

export default Template;
