import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
// import { Dispatch, useDispatch } from 'dva';
import Page from '@/components/Page';
import ThemeList from './ThemeList';
// import './index.less';

const Template: React.FC<{}> = () => {
  // const dispatch = useDispatch<Dispatch>();

  // reset redux data when component destroyed
  useEffect(() => {
    return () => {
      console.log('页面销毁');
    };
  }, []);

  return (
    <Page title={intl.get('push.theme.title')}>
      <ThemeList />
    </Page>
  );
};

export default Template;
