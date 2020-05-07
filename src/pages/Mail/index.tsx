import React from 'react';
import { router, useSelector } from 'dva';
import Template from './Template';
import Overview from './Overview';
import Sensitive from '../SMS/Sensitive';
import Cronjob from './Cronjob';
import History from './History';
import { ConnectState } from '@/models';

const { Route, Switch, Redirect } = router;

const Create = React.lazy(() => import(/* webpackChunkName:"create~mail~tpl" */ './Template/CreateTemplate'));

interface MailProps {
  permission: number;
}

const Mail: React.FC<MailProps> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);

  return (
    <Switch>
      <Route path="/mail/overview" component={Overview} />
      <Route path="/mail/template" component={Template} />
      <Route path="/mail/sensitive" component={Sensitive} />
      <Route path="/mail/mass-send" component={Cronjob} />
      <Route path="/mail/history" component={History} />
      {permission === 1 && <Route path="/mail/create-template" component={Create} />}
      <Redirect to="/mail/overview" />
    </Switch>
  );
};

export default Mail;
