import React from 'react';
import intl from 'react-intl-universal';
import { Menu, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { storage } from '@/utils/tools';
import { languageList } from '@/config/index';
import './index.less';

const languageLabels = {
  'ms-MS': 'Malaysia',
  'zh-CN': '简体中文',
  'zh-TW': '繁体中文',
  'en-US': 'English',
};
const languageIcons = {
  'zh-CN': '🇨🇳',
  'ms-MS': '🇲🇸',
  'zh-TW': '🇭🇰',
  'en-US': '🇺🇸',
};

const LangDropdown: React.FC<{}> = () => {
  const currentLocale: any = intl.getInitOptions().currentLocale;
  const bindClick = (e: { key: string }) => {
    if (currentLocale === e.key) {
      return;
    }
    storage.setItem('lang_local', e.key);
    window.location.reload();
  };
  const menuHeaderDropdown = (
    <Menu onClick={bindClick} selectedKeys={[currentLocale]}>
      {languageList.map((locale) => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <div>
        <GlobalOutlined />
      </div>
    </Dropdown>
  );
};
export default LangDropdown;
