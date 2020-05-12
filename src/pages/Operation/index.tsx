import React from 'react';
import { router } from 'dva';
import Account from './Account';
import Merchant from './Merchant';

const { Route, Switch, Redirect } = router;

const Push: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/operation/merchant" component={Merchant} />
      <Route path="/operation/account" exact component={Account} />
      <Redirect to="/operation/merchant" />
    </Switch>
  );
};

export default Push;
