import React from 'react';
import { router } from 'dva';
import intl from 'react-intl-universal';
import { Row, Badge } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import AvatarDropdown from './AvatarDropdown';
import LangDropdown from './LangDropdown';
import ProductDropdown from './ProductDropdown/index';
import ShortcutList from './Shortcut';
import { storage } from '@/utils/tools';
import { Menu } from '@/services/login';
import './index.less';

const { NavLink } = router;
// page header
const Header: React.FC<{}> = () => {
  const menuListLocal: Menu[] = storage.getItem('menu_list');
  let menuList: Menu[] = [];
  menuListLocal &&
    menuListLocal.forEach((item) => {
      if (item.children) {
        menuList = menuList.concat(item.children);
      }
    });
  const isSingleProduct = menuList.filter((item) => item.children).length < 4;

  return (
    <Row className="header">
      <div>
        <div className="header-unit header-logo">
          <span className="header-logo-inner"></span>
        </div>
        <div className="header-unit header-service">
          <NavLink className="header-overview" to="/">
            <span className="header-overview-text">{intl.get('header')}</span>
          </NavLink>
          {!isSingleProduct && <ProductDropdown></ProductDropdown>}
        </div>
        <ShortcutList single={isSingleProduct} />
      </div>
      <ul className="header-right">
        <li className="header-notify">
          <Badge count={1} className="header-notify-badge">
            <MailOutlined />
          </Badge>
        </li>
        <li className="header-language">
          <LangDropdown />
        </li>
        <li className="header-user">
          <AvatarDropdown />
        </li>
      </ul>
    </Row>
  );
};

export default Header;
