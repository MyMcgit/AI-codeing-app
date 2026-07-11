import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { reqLogin } from '../../api/index';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import './index.scss';
import logo from '../../static/imgs/wer.png';

function Login() {
  const navigate = useNavigate();
  const isLogin = useAppStore((s) => s.userInfo.isLogin);
  const saveUserInfo = useAppStore((s) => s.saveUserInfo);

  const onFinish = async (values: { username: string; password: string }) => {
    // 1、获取用户的输入
    console.log('Received values of form: ', values);
    // 2、发起网络请求axios
    const result: any = await reqLogin(values);
    console.log(result, 123);
    const { code, msg, data } = result;
    if (code === 0) {
      // 1.将服务器返回的user信息，还有token交由store管理
      saveUserInfo(data);
      // 2.跳转到admin页面
      navigate('/admin/home', {
        replace: true,
      });
      message.success('登录成功！');
    } else {
      // 弹出一个提示框
      message.warning(msg);
    }
  };

  if (isLogin) {
    return <Navigate to={'/admin/home'} />;
  }

  return (
    <div className="login">
      <div className="bg">
        <header>
          <img src={logo} alt="123" />
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入您的用户名!',
                },
                {
                  max: 12,
                  message: '必须小于等于12位',
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    style={{ color: 'rgba(0,0,0,.25)' }}
                  />
                }
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined
                    className="site-form-item-icon"
                    style={{ color: 'rgba(0,0,0,.25)' }}
                  />
                }
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </div>
  );
}

export default Login;
