import React from 'react';
import { router, useSelector } from 'dva';
import Theme from './Theme';
import Record from './Record';
import Create from './Record/Create';
import { ConnectState } from '@/models';

const { Route, Switch, Redirect } = router;

const Push: React.FC<{}> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  return (
    <Switch>
      <Route path="/push/theme" component={Theme} />
      <Route path="/push/record" component={Record} />
      {permission === 1 && <Route path="/push/create" component={Create} />}
      <Redirect to="/push/theme" />
    </Switch>
  );
};

export default Push;
