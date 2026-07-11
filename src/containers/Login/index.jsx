import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { connect } from 'react-redux';
import { createSaveUserInfoAction } from '../../redux/action_creators/login_action'
import { reqLogin } from '../../api/index'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import './index.scss'
import logo from '../../static/imgs/wer.png'
import myaxios from "../../api/myAxios"

function Login(props) {
  const navigate = useNavigate()
  const { isLogin } = props
  const onFinish = async (values) => {
    // 1、获取用户的输入
    console.log('Received values of form: ', values);
    // 2、发起网络请求axios
    const result = await reqLogin(values)
    console.log(result, 123)
    const { code, msg, data } = result
    if (code === 0) {
      // 1.将服务器返回的user信息，还有token交由redux管理
      props.saveUserInfo(data)
      // 2.跳转到admin页面
      navigate('/admin/home', {
        replace: true
      })
      message.success('登录成功！')

    } else {
      // 弹出一个提示框
      message.warning(msg)
    }
  };
  if (isLogin) {
    return <Navigate to={'/admin/home'} />
  }
  // =================================================================================
  // const [pc, setPcc] = useState()

  // // 获取本地摄像头
  // async function getMedia() {
  //   // 浏览器开启安全上下文，才能获取摄像头。或者使用https才可以
  //   let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //   document.getElementById('localVideo').srcObject = stream;
  //   return stream
  // }

  // // 发起通话（用户A点击）
  // async function startCall() {
  //   await getMedia(); // 获取摄像头
  //   const config = {
  //     iceServers: [
  //       { urls: "stun:stun.l.google.com:19302" }, // 公共STUN服务器
  //       // 如需TURN，添加如：{ urls: "turn:turn.example.com", username: "user", credential: "pass" }
  //     ]
  //   };
  //   let pcc = new RTCPeerConnection(config);
  //   // setPc(pcc);

  //   // 接收远程流
  //   pcc.ontrack = e => {
  //     document.getElementById('remoteVideo').srcObject = e.streams[0];
  //   }
  //   // 创建 Offer
  //   const offer = await pcc.createOffer();
  //   await pcc.setLocalDescription(offer);
  //   console.log('A的Offer:', JSON.stringify(offer)); // 复制给B
  //   // 监听 ICE 候选
  //   pcc.onicecandidate = wer => {
  //     console.log(wer, 123);

  //     if (wer.candidate) {
  //       console.log('A的ICE候选:', JSON.stringify(wer.candidate)); // 复制给B
  //     }
  //   }
  // }


  // // 接听通话（用户B点击）
  // async function answerCall() {

  //   let localStream = await getMedia(); // 获取摄像头
  //   let pcc = new RTCPeerConnection(
  //     {
  //       iceServers: [
  //         { urls: 'stun:stun.l.google.com:19302' }, // 必须配置STUN
  //         // 如果需要TURN服务器（穿透严格防火墙），添加类似：
  //         // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
  //       ]
  //     }
  //   );
  //   // 保存至全局变量
  //   setPcc(pcc);

  //   // 添加本地流到连接
  //   localStream.getTracks().forEach(track => pcc.addTrack(track, localStream));
  //   // 监听 ICE 候选
  //   pcc.onicecandidate = e => {
  //     if (e.candidate) {
  //       console.log('B的ICE候选:', JSON.stringify(e.candidate)); // 复制给A
  //       // 上传ICE到服务器
  //       myaxios.get('api1/ice', { params: { ice: JSON.stringify(e.candidate) } })
  //     }
  //   };
  //   // 接收远程流
  //   pcc.ontrack = e => {
  //     document.getElementById('remoteVideo').srcObject = e.streams[0];
  //   };

  //   // 处理A的Offer
  //   // offer 一：复制粘贴offer
  //   // const offer = JSON.parse(prompt('粘贴A的Offer:'));
  //   // offer 二：从服务器拿offer
  //   const offer = await myaxios.get('api1/offers')

  //   let offerObj = JSON.parse(offer.data)
  //   await pcc.setRemoteDescription(offerObj);
  //   myaxios.get('api1/answer', { params: { answer: JSON.stringify({ a: 1 }) } })

  //   // 创建 Answer

  //   // 正确生成 Answer
  //   const answer = await pcc.createAnswer();
  //   console.log('B的Answer:', answer); // 复制给A
  //   await pcc.setLocalDescription(answer);
  //   // 上传Answer到服务器
  //   myaxios.post('api1/answer', { answer })
  //   // 设置本地 Answer

  // }

  // // 通用：添加对方的 ICE 候选
  // const addCandidate = async () => {
  //   const candidate = JSON.parse(prompt('粘贴候选:'));
  //   await pc?.addIceCandidate(candidate);
  // };
  // // 用户A建立与用户B的连接
  // window.connectA = async function () {
  //   const answer = JSON.parse(prompt('粘贴B给的纯JSON:'));
  //   await pc?.setRemoteDescription(answer);
  // }
  // =================================================================================
  return (
    // =================================================================================
    // <div>
    //   <video id="localVideo" autoPlay muted></video>
    //   <video id="remoteVideo" autoPlay ></video>

    //   <button onClick={startCall}>发起通话</button>
    //   <button onClick={answerCall}>接听通话</button>
    //   <button onClick={addCandidate}>添加ICE候选</button>

    // </div >
    // =================================================================================

    <div className='login'>
      <div className='bg'>
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
              /*
                用户名/密码的合法性要求
                  1.必须输入
                  2.必须大于等于4位
                  3.必须小于等于12位
                  4.必须是英文、数字或下划线组成
              */
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
              <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名" />

            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
                // 自定义验证
                // (rule, value) =>{ 
                //   console.log(rule,value);
                // }
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </div>
  )
}

export default connect(
  state => ({ isLogin: state.userInfo.isLogin }),
  {
    saveUserInfo: createSaveUserInfoAction
  }
)(Login)
