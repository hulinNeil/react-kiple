import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Dispatch, useDispatch } from 'dva';
import Page from '@/components/Page';
import CreateCronjob from './CreateCronjob';
import CronjobList from './CronjobList';
import './index.less';

const Cronjob: React.FC<{}> = () => {
  const dispatch = useDispatch<Dispatch>();

  // reset redux data when component destroyed
  useEffect(() => {
    return () => {
      dispatch({
        type: 'smsCronjob/reset',
      });
    };
  }, []);

  return (
    <Page title={intl.get('sms.send.title')}>
      <CronjobList />
      <CreateCronjob />
    </Page>
  );
};

export default Cronjob;
