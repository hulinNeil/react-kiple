import React, { useState } from 'react';
import { router } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import { Checkbox, Button, Tooltip } from 'antd';
import { storage } from '@/utils/tools';
import { shortcutMaxLength } from '@/config';
import { Menu } from '@/services/login';
import './index.less';

const { NavLink } = router;

export interface ShortcutListProps {
  single: boolean;
}

const ShortcutList: React.FC<ShortcutListProps> = ({ single }) => {
  const menuListLocal: Menu[] = storage.getItem('menu_list') || [];
  let menuList: Menu[] = [];
  menuListLocal.forEach((item: any) => {
    menuList = menuList.concat(item.children);
  });
  const noExternalLinks = menuList.filter((item) => item.children);

  const [menuVisible, setMenuVisible] = useState(false);
  const [shortcutList, setShortcutList] = useState<Menu[]>(single ? noExternalLinks : storage.getItem('shortcut_list') || []);

  const onChange = (e) => {
    const newShortcutList: Menu[] = [];
    e.forEach((item) => {
      const shortcut = menuList.find((i) => i.key === item);
      if (shortcut) {
        newShortcutList.push(shortcut);
      }
    });
    setShortcutList(newShortcutList);
  };

  const bindSave = () => {
    storage.setItem('shortcut_list', shortcutList);
    setMenuVisible(false);
  };

  const bindCancel = () => {
    const shortcutList = storage.getItem('shortcut_list') || [];
    setMenuVisible(false);
    setShortcutList(shortcutList);
  };

  const removeTag = (index: number) => {
    const shortcutListSync = JSON.parse(JSON.stringify(shortcutList));
    shortcutListSync.splice(index, 1);
    setShortcutList(shortcutListSync);
  };

  const productListRender = () => {
    const shortcutKeyList = shortcutList.map((item) => item.key);
    const shortcutLength = shortcutKeyList.length;
    return (
      <div className="check-product" style={{ display: menuVisible ? 'flex' : 'none' }}>
        <div className="header-product-title">
          固定至导航 ({shortcutList.length}/{shortcutMaxLength})
        </div>
        <Checkbox.Group className="header-product-list" value={shortcutKeyList} onChange={onChange}>
          {menuListLocal.map((item, index) => (
            <div className="product-col" key={`product-${index}`}>
              <div className="product-col-title">
                <img src={item.icon} alt={item.title} />
                <span>{item.title}</span>
              </div>
              {item.children &&
                item.children.map(
                  (pro) =>
                    pro.children &&
                    pro.children.length && (
                      <div className="product-col-item" key={pro.key}>
                        <Checkbox
                          className="product-col-item"
                          value={pro.key}
                          disabled={shortcutLength >= shortcutMaxLength && !~shortcutKeyList.indexOf(pro.key)}
                        >
                          {pro.title}
                        </Checkbox>
                      </div>
                    )
                )}
            </div>
          ))}
        </Checkbox.Group>
        <div className="header-product-tool">
          <Button className="check-product-save" onClick={bindSave}>
            保存
          </Button>
          <Button className="check-product-cancel" ghost={true} onClick={bindCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="header-unit header-shortcut">
      <ul className="header-shortcut-list">
        {shortcutList.map(
          (item, index) =>
            item.children && (
              <li key={`shortcut-${index}`}>
                {menuVisible ? (
                  <Tooltip title="点击移除此标签" overlayClassName="header-shortcut-editing-hover">
                    <a className="header-shortcut-editing" onClick={() => removeTag(index)}>
                      {item.title}
                    </a>
                  </Tooltip>
                ) : (
                  <NavLink to={item.key} title={item.title} activeClassName="active">
                    {item.title}
                  </NavLink>
                )}
              </li>
            )
        )}
        {!menuVisible && !single && (
          <li className="header-shortcut-add" onClick={() => setMenuVisible(true)}>
            <PlusOutlined />
          </li>
        )}
      </ul>
      {!single && productListRender()}
    </div>
  );
};

export default ShortcutList;
