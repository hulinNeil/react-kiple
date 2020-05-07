import React from 'react';
import { Card } from 'antd';
import Page from '@/components/Page';

const Index: React.FC<{}> = () => {
  return (
    <Page title="概览">
      <Card>这里是邮件的首页，应该有几个图标和介绍</Card>
      <Card>Role</Card>
    </Page>
  );
};

export default Index;
