import React from 'react';
import { router, Dispatch, useSelector, useDispatch } from 'dva';
import { Avatar, Menu, Spin, Dropdown } from 'antd';
import { DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models/index';
import './index.less';

const { withRouter } = router;

const AvatarDropdown: React.FC<{}> = () => {
  const userInfo = useSelector((state: ConnectState) => state.user.userInfo);
  const dispatch = useDispatch<Dispatch>();

  const bindClick = (e: { key: string }): void => {
    if (e.key === 'logout') {
      dispatch({
        type: 'user/logout',
      });
    }
  };
  const menuHeaderDropdown = (
    <Menu onClick={bindClick}>
      <Menu.Item key="center">
        <UserOutlined /> 个人中心
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined /> 个人设置
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
