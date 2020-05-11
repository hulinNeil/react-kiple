import React from 'react';
import { router } from 'dva';
import Overview from './Overview';

const { Route, Switch, Redirect } = router;

interface MailProps {
  permission: number;
}

const Mail: React.FC<MailProps> = () => {
  return (
    <Switch>
      <Route path="/account/overview" component={Overview} />
      <Redirect to="/account/overview" />
    </Switch>
  );
};

export default Mail;
