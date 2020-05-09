import React from 'react';
import { router, Dispatch, useSelector, useDispatch } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { History } from 'history';
import { Layout, Spin } from 'antd';
import { storage } from '@/utils/tools';
import { Menu } from '@/services/login';
import LeftNav from '@/components/LeftNav';
import Header from '@/components/Header';
import Home from '../Home';
import { ConnectState } from '@/models/index';
import './index.less';

const { Route, Switch, Redirect, withRouter } = router;
interface IndexProps extends RouteComponentProps {
  history: History;
}

// 路由懒加载(Road load by lazy)
const Merchant = React.lazy(() => import(/* webpackChunkName:"Merchant" */ '../Merchant'));
const Charts = React.lazy(() => import(/* webpackChunkName:"Charts" */ '../Charts'));
const SMS = React.lazy(() => import(/* webpackChunkName:"SMS" */ '../SMS'));
const Mail = React.lazy(() => import(/* webpackChunkName:"Mail" */ '../Mail'));
const Push = React.lazy(() => import(/* webpackChunkName:"Push" */ '../Push'));
const Account = React.lazy(() => import(/* webpackChunkName:"Account" */ '../Account'));

const Index: React.FC<IndexProps> = ({ history }) => {
  const currentMenuIndex = useSelector((state: ConnectState) => state.admin.currentMenuIndex);
  let loggedIn = useSelector((state: ConnectState) => state.user.loggedIn);
  const dispatch = useDispatch<Dispatch>();

  const userInfo = storage.getItem('user_key');
  if (!loggedIn && userInfo) {
    loggedIn = true;
    dispatch({
      type: 'user/checkStatus',
      payload: { userInfo },
    });
  }
  // Verify login status
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }
  let menuList: Menu[] = [];

  const menuListLocal: Menu[] = storage.getItem('menu_list') || [];
  menuListLocal.forEach((item) => {
    if (item.children) {
      menuList = menuList.concat(item.children);
    }
  });
  const path = location.pathname;

  const menu = menuList[currentMenuIndex];
  // Verify router permissions
  if (!menu && path !== '/') {
    history.replace('/');
  }

  return (
    <div className="page">
      <Header />
      <Layout className="container">
        {menu ? <LeftNav menu={menu} path={path} /> : ''}
        {/* React.Suspense will show loading when the page loads  */}
        <React.Suspense
          fallback={
            <div className="page-loading">
              <Spin size="large" />
            </div>
          }
        >
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/merchant" component={Merchant} />
            <Route path="/charts" component={Charts} />
            <Route path="/sms" component={SMS} />
            <Route path="/mail" component={Mail} />
            <Route path="/push" component={Push} />
            <Route path="/account" component={Account} />
            <Redirect to="/" />
          </Switch>
        </React.Suspense>
      </Layout>
    </div>
  );
};

export default withRouter(Index);
