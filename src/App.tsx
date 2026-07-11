import { useRoutes, Navigate } from 'react-router-dom';
import { arr, adminChild } from './router';
import { useAppStore } from './store';

export default function App() {
  const user = useAppStore((s) => s.userInfo.user);

  // 权限管理：是否具有该权限
  function hasAuth(item: { path: string; children?: { path: string }[] }) {
    if (!item.children) {
      return user?.role?.includes(item.path);
    } else if (item.children) {
      return item.children.find((item2) => {
        return user?.role?.includes(item2.path);
      });
    }
  }

  if (user?.username === 'admin') {
    arr[1].children = adminChild;
  } else if (user?.username) {
    // 筛选具有权限的路由
    const newarr = adminChild.filter((item) => {
      if (hasAuth(item)) return item;
      return false;
    });
    newarr.push({
      path: '',
      element: <Navigate to="home" />,
    });
    if (newarr.length) arr[1].children = newarr;
  }

  const element = useRoutes(arr);
  return <div className="app">{element}</div>;
}
