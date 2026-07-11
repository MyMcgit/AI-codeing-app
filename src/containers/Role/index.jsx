import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import {Button, Card,Modal,Input,Table,Form, message,Tree} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import {PRIMARY} from '../../config'
import Menu from '../../config/menu_config'
import {reqRoleList,reqAddRole,reqAuthRole} from '../../api'

function Role(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [roleList,setRoleList] = useState([])
  const [roleId,setRoleId] = useState('')
  const [Formref] = Form.useForm()
  // -------------tree-state-start-----------------------
  // const [expandedKeys, setExpandedKeys] = useState([]);//配置默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState([]);//以经选中的菜单
  // const [selectedKeys, setSelectedKeys] = useState([]);
  // const [autoExpandParent, setAutoExpandParent] = useState(true);
  // -------------tree-state-end-----------------------
  const showModal = () => {
    setIsModalOpen(true);
  };
  // 新增角色弹窗---确认按钮
  const handleOk = () => {
    // 点击ok，提交表单
    Formref.submit()
    setIsModalOpen(false);
  };
  // 授权弹窗---确认按钮
  const handleAuthOk =async () => {
    // 发起请求授权（提交受控表单里的数据）
    let result = await reqAuthRole({
      _id:roleId,
      menus:checkedKeys,
      auth_name:props.username
    })
    const {code,data} = result
    if(code===0){
      console.log(data);
      message.success('授权成功')
      // 刷新页面数据，发起请求列表
      getRoleList()
      setIsAuthOpen(false)
    }else{
      message.error('授权失败')
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleAuthCancel = () => {
    setIsAuthOpen(false);
  };
  // 异步函数，请求添加角色
  async function addRole(values){
   const result = await reqAddRole(values)
   const {code} = result
   if(code === 0){
    message.success('添加成功')
    // 更新当前页面数据
    getRoleList()
   }else{
    message.error('添加失败')
   }
  }
  // 新增角色弹窗---提交表单
  const onFinish = (values) => {
    console.log('Success:', values);
    // 发起请求添加角色
    addRole(values)
    // 然后重置表单
    Formref.resetFields()
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 请求角色列表
  async function getRoleList(){
   let result = await reqRoleList()
   let {code,data} = result
   if(code === 0){
    setRoleList(data)
   }
  }
  useEffect(()=>{
    // 组件挂载时，调用一次请求角色列表
    getRoleList()
  },[])
  // const dataSource = [
  //   {
  //     munus:[],
  //     _id:'eqwrqewr',
  //     name: '测试1',
  //     create_time: '2023-3-5',
  //     auth_time: '2023-3-5',
  //     auth_name:'admin'
  //   },
  // ]

  // -------------tree-methods-start-----------------------
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    // setExpandedKeys(expandedKeysValue);
    // setAutoExpandParent(false);
  };
  
  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  // const onSelect = (selectedKeysValue, info) => {
  //   console.log('onSelect', info);
  //   setSelectedKeys(selectedKeysValue);
  // };
  // -------------tree-methods-end-----------------------
  function showAuth(id){
    // 将角色id维护到组件状态里，做受控表单
    setRoleId(id)
    let result = roleList.find((item)=>{
      return item._id === id
    })
    // 回显树形菜单
    setCheckedKeys(result.menus)
    setIsAuthOpen(true)
  }
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render:(time)=>dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      key: 'auth_time',
      render:(time)=>time?dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss'):''
    },
    {
      title: '授权人',
      dataIndex: 'auth_name',
      key: 'auth_name',
    },
    {
      title: '操作',
      key: 'operate',
      render:({_id})=> <Button type='link' style={{color:PRIMARY}} onClick={()=>{showAuth(_id)}}>设置权限</Button>
    },

  ];
  // treData是树形菜单的源数据
  const treeData = [
    {
      title: '平台',
      key: 'top',
      children: Menu
    },
  ];
  return (
    <Card
      title={
        <div>
          <Button  type="primary" onClick={showModal}>
          <PlusOutlined />
            新增角色
          </Button>
        </div>
      }
    >
      <Table dataSource={roleList} columns={columns} rowKey={'_id'}/>;
      <Modal title="新增角色" okText='确认' cancelText='取消' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name='addRole'
          form={Formref}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="角色名"
            name="roleName"
            rules={[
              {
                required: true,
                message: '请输入角色名!',
              },
            ]}
          >
            <Input  placeholder='请输入角色名'/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="设置权限" okText='确认' cancelText='取消' open={isAuthOpen} onOk={handleAuthOk} onCancel={handleAuthCancel}>
        <Tree 
          checkable//允许选择
          onExpand={onExpand}//收缩展开的回调
          // expandedKeys={expandedKeys}//一上来就展开
          // autoExpandParent={autoExpandParent}//一上来是否自动展开默认展开节点的父节点
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          // onSelect={onSelect}
          // selectedKeys={selectedKeys}
          defaultExpandAll={true}
          treeData={treeData}
        />
      </Modal>
    </Card>
  )
}

export default  connect(
  state => ({username:state.userInfo.user.username}),
  {}
)(Role)