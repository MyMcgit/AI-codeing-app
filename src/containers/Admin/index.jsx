import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import { createDeleteUserInfoAction } from '../../redux/action_creators/login_action'
import { connect } from 'react-redux'
import Header from './Header';
import Sidebar from './Sidebar';
import css from './index.module.scss'
import { Layout } from 'antd';


function Admin(props) {
  const { Footer, Sider, Content } = Layout;
  const navigate = useNavigate()

  useEffect(() => {
    // navigate('home')
    // 判断用户是否登录，若未登录跳转Login页面
    if (!isLogin) navigate('/login', { replace: true })
  })
  const { isLogin } = props.userInfo
  return (
    <Layout className={css.admin}>
      <Sider className={css.sider}>
        <Sidebar />
      </Sider>
      <Layout >
        <Header />
        <Content className={css.content}>
          <div className={css.content_view}>
            <Outlet />
          </div>
        </Content>
        <Footer className={css.footer}>推荐使用谷歌浏览器，获取最佳用户体验 </Footer>
      </Layout>
    </Layout>
  )
}
// 如下代码中的所有key是控制容器组件传递给UI组件的key
// 如下代码中的所有value是控制容器组件传递给UI组件的value
export default connect(
  state => ({ userInfo: state.userInfo }),
  {
    deleteUserInfo: createDeleteUserInfoAction
  }
)(Admin)
