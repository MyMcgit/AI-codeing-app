import React from 'react'
import {useLocation} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {connect} from 'react-redux'
import { createSaveTitleAction } from '../../../redux/action_creators/title_action';
//引入菜单配置
import menu from '../../../config/menu_config'
import { Menu } from 'antd';
import logo from '../../../static/imgs/wer.png'
import './index.scss'
// 组件
function Sidebar(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const location = useLocation()
  // const toggleCollapsed = () => {
  // setCollapsed(!collapsed);
  // };
  const navigate=useNavigate()

  // 是否具有菜单权限
  function hasAuth(item){
    const {username,role} = props.userInfo.user
    // console.log(role);
    if(username === 'admin'&&role){
      return true
    }
    else if(!item.children&&role){
      // 没有孩子，直接判断当前菜单的key是否处于角色的权限列表role里面
      return role.includes(item.key)
    }else if(item.children&&role){
      // 有孩子，则判断有没有孩子处于角色的权限列表role里面
      return item.children.find((item2)=>{ return role.includes(item2.key)})
    }
  }
  // 定义创建菜单的递归函数
  function createMenu(menuarr){
      if(menuarr){
        let arr= menuarr.map(item=>{
          // console.log(item);
          if(hasAuth(item)){
            return {
              key:item.key,
              icon:item.icon,
              children:createMenu(item.children),
              label:item.title
            }
          }
        }
        )
        return arr.filter((item)=>{
          return item
        })
      }
  }
  // 定义items
  const items = createMenu(menu)
  // console.log(items);
  // 选中标签跳转至对应路径
  function selectItem({ item, key, keyPath, selectedKeys, domEvent }){
    // console.log(domEvent.target.innerHTML);
    // 保存title至redux
    props.saveTitle(domEvent.target.innerHTML)
      if(keyPath[1]){
          navigate(keyPath[1]+'/'+keyPath[0])
      }else{
          navigate(key)
      }
  }
  // selectedKeys的值，根据地址决定侧边栏标签高亮
  function fn(){
    if(location.pathname.includes('product')){
      return 'product'
    }
    return location.pathname.split('/').reverse()[0]
  }
  return (
    <div className='sidebar'>
        <header className='nav_header'>
            <img src={logo} alt="" />
            <h1>商品管理系统</h1>
        </header>
      <Menu
        selectedKeys={fn()}
        defaultOpenKeys={location.pathname.split('/').splice(2)}
        mode="inline"
        theme="dark"
        // inlineCollapsed={collapsed}
        items={items}
        onSelect={selectItem}
      />
    </div>
  )
}
export default  connect(
  state => ({
    userInfo:state.userInfo
  }),
  {
    saveTitle:createSaveTitleAction
  }
)(Sidebar)
