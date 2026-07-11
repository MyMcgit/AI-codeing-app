import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import css from './index.module.scss';
import { Layout } from 'antd';
import { useAppStore } from '../../store';

function Admin() {
  const { Footer, Sider, Content } = Layout;
  const navigate = useNavigate();
  const isLogin = useAppStore((s) => s.userInfo.isLogin);

  useEffect(() => {
    // 判断用户是否登录，若未登录跳转Login页面
    if (!isLogin) navigate('/login', { replace: true });
  });

  return (
    <Layout className={css.admin}>
      <Sider className={css.sider}>
        <Sidebar />
      </Sider>
      <Layout>
        <Header />
        <Content className={css.content}>
          <div className={css.content_view}>
            <Outlet />
          </div>
        </Content>
        <Footer className={css.footer}>
          推荐使用谷歌浏览器，获取最佳用户体验
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Admin;
