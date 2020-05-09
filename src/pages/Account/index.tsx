import React from 'react';
import { router } from 'dva';
import Overview from './Overview';
import Security from './Security';

const { Route, Switch, Redirect } = router;

interface MailProps {
  permission: number;
}

const Mail: React.FC<MailProps> = () => {
  return (
    <Switch>
      <Route path="/account/overview" component={Overview} />
      <Route path="/account/security" component={Security} />
      <Redirect to="/account/overview" />
    </Switch>
  );
};

export default Mail;
