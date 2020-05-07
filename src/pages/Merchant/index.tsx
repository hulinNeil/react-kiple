import React from 'react';
import { router } from 'dva';
import './index.less';
import User from './User';
import Role from './Role';
const { Route, Switch, Redirect } = router;

const Merchant: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/merchant/user" component={User} />
      <Route path="/merchant/role" component={Role} />
      <Redirect to="/merchant/user" />
    </Switch>
  );
};

export default Merchant;
