import React, { Component } from 'react';
import { router } from 'dva';

import Bar from './Bar';
import Radar from './Radar';

const { Route, Switch, Redirect } = router;

class Charts extends Component {
  render() {
    return (
      <Switch>
        <Route path="/charts/bar" component={Bar} />
        <Route path="/charts/radar" component={Radar} />
        <Redirect to="/charts/bar" />
      </Switch>
    );
  }
}
export default Charts;
