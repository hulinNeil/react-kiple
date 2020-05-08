import React from 'react';
import { router, useSelector } from 'dva';
import Topic from './Topic';
import Cronjob from './Cronjob';
import Create from './Cronjob/Create';
import { ConnectState } from '@/models';

const { Route, Switch, Redirect } = router;

const Push: React.FC<{}> = () => {
  const permission = useSelector((state: ConnectState) => state.user.userInfo.permission);
  return (
    <Switch>
      <Route path="/push/topic" component={Topic} />
      <Route path="/push/cronjob" exact component={Cronjob} />
      {/* Determine if you have permission to access the create page */}
      {permission === 1 && <Route path="/push/cronjob/create" component={Create} />}
      <Redirect to="/push/topic" />
    </Switch>
  );
};

export default Push;
