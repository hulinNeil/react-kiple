import React from 'react';
import { router } from 'dva';
import { Menu, Layout } from 'antd';
import { PieChartOutlined, DesktopOutlined, MailOutlined, UnorderedListOutlined, ProjectOutlined, WarningOutlined } from '@ant-design/icons';
import './index.less';

const { SubMenu, Item } = Menu;
const { Link } = router;
const IconAlls = {
  PieChartOutlined,
  DesktopOutlined,
  MailOutlined,
  UnorderedListOutlined,
  ProjectOutlined,
  WarningOutlined,
};

export interface LeftNavProps {
  path: string;
  menu: any;
}

const LeftNav: React.FC<LeftNavProps> = (props) => {
  const renderMenItem = (pathname: string) => (item: any) => {
    if (pathname === item.key) {
      document.title = `${item.title} - Kiple`;
    }
    return (
      <Item key={item.key}>
        <Link to={item.key}>
          {item.icon && IconAlls[item.icon] ? React.createElement(IconAlls[item.icon]) : <span> · </span>}
          <span>{item.title}</span>
        </Link>
      </Item>
    );
  };
  const { path, menu } = props;
  const { title, children, icon } = menu;
  let openKey = '';
  const MenuItems = children.map((item) => {
    if (item.children && item.children.length > 0) {
      openKey = item.children.find((o) => path === o.key) ? item.key : '';
      return (
        <SubMenu
          key={item.key}
          title={
            <span>
              {item.icon && IconAlls[item.icon] ? React.createElement(IconAlls[item.icon]) : <span className=""></span>}
              <span>{item.title}</span>
            </span>
          }
        >
          {item.children.map(renderMenItem(path))}
        </SubMenu>
      );
    } else {
      return renderMenItem(path)(item);
    }
  });

  return (
    <Layout.Sider collapsible className="left-nav">
      <h2 className="left-nav-title">
        <img src={icon} alt={title} />
        <span>{title}</span>
      </h2>
      <div className="left-nav-menu">
        <Menu selectedKeys={[path]} openKeys={[openKey]} mode="inline" theme="dark">
          {MenuItems}
        </Menu>
      </div>
    </Layout.Sider>
  );
};

export default LeftNav;
