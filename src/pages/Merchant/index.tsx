import React from 'react';
import { router } from 'dva';
import './index.less';
import User from './User';
import Sub from './Sub';
import Overview from './Overview';
import Security from './Security';

const { Route, Switch, Redirect } = router;

const Merchant: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/merchant/overview" component={Overview} />
      <Route path="/merchant/user" component={User} />
      <Route path="/merchant/sub" component={Sub} />
      <Route path="/merchant/security" component={Security} />
      <Redirect to="/merchant/overview" />
    </Switch>
  );
};

export default Merchant;
