import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Dispatch, useDispatch } from 'dva';
import Page from '@/components/Page';
import TopicList from './TopicList';
import CreatePushTopic from './CreateTopic';

const Template: React.FC<{}> = () => {
  const dispatch = useDispatch<Dispatch>();

  // reset redux data when component destroyed
  useEffect(() => {
    return () => {
      dispatch({
        type: 'pushTopic/reset',
      });
    };
  }, []);

  return (
    <Page title={intl.get('push.topic.title')}>
      <TopicList />
      <CreatePushTopic />
    </Page>
  );
};

export default Template;
