import React from 'react';
import { router, Dispatch, useSelector, useDispatch } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { History } from 'history';
import { Avatar, Menu, Spin, Dropdown } from 'antd';
import { DownOutlined, LogoutOutlined, AccountBookOutlined, UserOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models/index';
import './index.less';

const { withRouter } = router;

interface AvatarDropdownProp extends RouteComponentProps {
  history: History;
}

const AvatarDropdown: React.FC<AvatarDropdownProp> = ({ history }) => {
  const userInfo = useSelector((state: ConnectState) => state.user.userInfo);
  const dispatch = useDispatch<Dispatch>();
  const selectKey = location.pathname.split('/')[1];
  const bindClick = (e: { key: string }): void => {
    if (selectKey === e.key) {
      return;
    }
    switch (e.key) {
      case 'logout':
        dispatch({
          type: 'user/logout',
        });
        break;
      case 'account':
        history.push('/account');
        break;
      case 'merchant':
        history.push('/merchant');
        break;
      default:
        break;
    }
  };
  const menuHeaderDropdown = (
    <Menu onClick={bindClick} selectedKeys={[selectKey]}>
      <Menu.Item key="account">
        <UserOutlined /> 个人中心
      </Menu.Item>
      <Menu.Item key="merchant">
        <AccountBookOutlined /> 商户中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );
  return userInfo && userInfo.userName ? (
    <Dropdown overlay={menuHeaderDropdown}>
      <span className="account">
        {userInfo.avatar ? (
          <Avatar size={20} className="avatar" src={userInfo.avatar} alt="avatar" />
        ) : (
          <Avatar size={20} className="avatar" icon={<UserOutlined />} alt="avatar" />
        )}
        <span className="name">{userInfo.userName}</span>
        <DownOutlined />
      </span>
    </Dropdown>
  ) : (
    <Spin
      size="small"
      style={{
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  );
};

export default withRouter(AvatarDropdown);
