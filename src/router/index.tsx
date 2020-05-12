import React from 'react';
import { router, dynamic } from 'dva';
const { Router, Route, Switch, Redirect } = router;

/**
 *
 * @param history 路由中的history对象（The history object in the route）
 * @param app dva实例（Dva instance）
 */

function RouterConfig({ history, app }: any) {
  // 动态加载(Road load by lazy)
  const Login = dynamic({
    app,
    component: () => import(/* webpackChunkName:"Login" */ '@/pages/Account/Login'),
  });
  const RetrievePwd = dynamic({
    app,
    component: () => import(/* webpackChunkName:"Login" */ '@/pages/Account/RetrievePwd'),
  });
  const Register = dynamic({
    app,
    component: () => import(/* webpackChunkName:"Login" */ '@/pages/Account/Register'),
  });

  const Index = dynamic({
    app,
    component: () => import(/* webpackChunkName:"Index" */ '@/pages/Index'),
  });

  

  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/password_reset" component={RetrievePwd} />
        <Route path="/" component={Index} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
