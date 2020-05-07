import React from 'react';
import { router } from 'dva';
import Template from './Template';
import Overview from './Overview';
import Sensitive from './Sensitive';
import Cronjob from './Cronjob';
import History from './History';

const { Route, Switch, Redirect } = router;

const SMS: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/sms/overview" component={Overview} />
      <Route path="/sms/template" component={Template} />
      <Route path="/sms/sensitive" component={Sensitive} />
      <Route path="/sms/mass-send" component={Cronjob} />
      <Route path="/sms/history" component={History} />
      <Redirect to="/sms/overview" />
    </Switch>
  );
};

export default SMS;
