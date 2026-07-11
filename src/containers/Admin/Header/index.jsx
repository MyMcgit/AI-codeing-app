import React from 'react'
import {useEffect,useState} from 'react'
import {useLocation} from 'react-router-dom'
import {Button, Modal} from 'antd'
import {FullscreenOutlined,FullscreenExitOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'

// 引入全屏插件
import screenfull from 'screenfull'

// 引入day.js
import dayjs from 'dayjs'

// 引入查询天气的api
import { reqweather } from '../../../api'

// 
import meunList from '../../../config/menu_config'
import './index.scss'


function Header(props) {

    // 定义全屏状态
    const [isfull,setisfull] =  useState(screenfull.isFullscreen)

    // 定义日期
    const [time,settime] = useState(dayjs().format('YYYY年 MM月DD日 HH:mm:ss'))

    // 定义天气
    const [lives,setlives] = useState([])

    // 定义当前路由名称
    const [pathTitle,setPathTitle] = useState('')

    const path = useLocation().pathname.split('/').reverse()[0]

    const {username} = props.userInfo.user
    const {title} = props
    const { confirm } = Modal;

    // 生命周期
    useEffect(()=>{
          // 获取天气预报(高德接口)
          reqweather().then((res)=>{setlives(res.lives[0])})

          // 给screenfull绑定监听
          screenfull.on('change', () => {
            setisfull(screenfull.isFullscreen)
          });

          // 给header组件加上定时器
          const timer= setInterval(() => {
            settime(dayjs().format('YYYY年 MM月DD日 HH:mm:ss'))
          }, 1000);

          // 获取当前路由的名称
          getPathTitle(path,meunList)

          return ()=>{
            clearInterval(timer)
          }
        },[]
    )

    // 退出登录方法
    function logout(){
      confirm({
        title: <h1 style={{fontSize:'20px'}}>确定退出？</h1>,
        content: <p style={{color:'rgba(0,0,0,0.5)'}}>若退出需要重新登录</p>,
        onOk() {
          props.deleteUserInfo()
        },
        cancelText:'取消',
        okText:'确定',
      });
      
    }

    // 切换全屏
    function fullscreen(){
      screenfull.toggle()
    }

    // 定义获取当前路由标题的方法(只在初始化和刷新时redux失效时调用)
    function getPathTitle(path,list){
      // console.log(123);
      list.forEach((item)=>{
        if(item.children){
           getPathTitle(path,item.children)
        }else{
          if(path.split('/').reverse()[0] === item.key){
            setPathTitle(item.title)
          }
        }
      })
    }

  return (
    <header className='header'>
        <div className='header_top'>
        <Button size='small' onClick={fullscreen}>{isfull ?<FullscreenExitOutlined /> :<FullscreenOutlined /> }</Button>
            <span className='username'>欢迎，{username}</span>
            <Button type='link' className='logout' onClick={logout}>退出登录</Button>
        </div>
        <div className='header_bottom'>
            <div className='header_bottom_left'>{title||pathTitle}</div>
            <div className='header_bottom_right'>
             {time}
             &nbsp;&nbsp;&nbsp;
            {lives.weather} &nbsp;&nbsp;&nbsp;{lives.temperature}℃
            </div>
        </div>
    </header>
  )
}
export default  connect(
  state => ({
    userInfo:state.userInfo,
    title:state.title
  }),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
)(Header)
