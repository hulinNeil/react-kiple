import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, Dispatch } from 'dva';
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
        type: 'mailCronjob/reset',
      });
    };
  }, []);

  return (
    <Page title={intl.get('mail.send.title')}>
      <CronjobList />
      <CreateCronjob />
    </Page>
  );
};

export default Cronjob;
