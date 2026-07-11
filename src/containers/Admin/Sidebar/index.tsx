import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';

// 引入菜单配置
import menu from '../../../config/menu_config';
import type { MenuItemConfig } from '../../../config/menu_config';
import { Menu } from 'antd';
import logo from '../../../static/imgs/wer.png';
import './index.scss';

// 组件
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.userInfo.user);
  const saveTitle = useAppStore((s) => s.saveTitle);

  // 是否具有菜单权限
  function hasAuth(item: MenuItemConfig) {
    const username = user?.username;
    const role = user?.role;
    if (username === 'admin' && role) {
      return true;
    } else if (!item.children && role) {
      return role.includes(item.key);
    } else if (item.children && role) {
      return item.children.find((item2) => {
        return role.includes(item2.key);
      });
    }
  }

  // 定义创建菜单的递归函数
  function createMenu(menuarr: MenuItemConfig[] | undefined) {
    if (menuarr) {
      const arr = menuarr.map((item) => {
        if (hasAuth(item)) {
          return {
            key: item.key,
            icon: item.icon,
            children: createMenu(item.children),
            label: item.title,
          };
        }
      });
      return arr.filter((item) => {
        return item;
      });
    }
  }

  // 定义items
  const items = createMenu(menu);

  // 选中标签跳转至对应路径
  function selectItem(info: any) {
    const { key, keyPath, domEvent } = info;
    // 保存title至store
    saveTitle((domEvent.target as HTMLElement).innerHTML);
    if (keyPath[1]) {
      navigate(keyPath[1] + '/' + keyPath[0]);
    } else {
      navigate(key);
    }
  }

  // selectedKeys的值，根据地址决定侧边栏标签高亮
  function fn() {
    if (location.pathname.includes('product')) {
      return 'product';
    }
    return location.pathname.split('/').reverse()[0];
  }

  return (
    <div className="sidebar">
      <header className="nav_header">
        <img src={logo} alt="" />
        <h1>商品管理系统</h1>
      </header>
      <Menu
        selectedKeys={[fn()]}
        defaultOpenKeys={location.pathname.split('/').splice(2)}
        mode="inline"
        theme="dark"
        items={items}
        onSelect={selectItem}
      />
    </div>
  );
}

export default Sidebar;
