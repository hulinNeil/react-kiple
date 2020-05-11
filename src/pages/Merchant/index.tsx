import React from 'react';
import { router } from 'dva';
import './index.less';
import User from './User';
import Sub from './Sub';
import Overview from '@/pages/Account/Overview';

const { Route, Switch, Redirect } = router;

const Merchant: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/merchant/overview" component={Overview} />
      <Route path="/merchant/user" component={User} />
      <Route path="/merchant/sub" component={Sub} />
      <Redirect to="/merchant/overview" />
    </Switch>
  );
};

export default Merchant;
