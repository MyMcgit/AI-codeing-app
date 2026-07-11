import React ,{useEffect,useState}from 'react'
import {Card, Button,Table,Modal,Form,Input, message } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList,reqAddCategory,reqUpdateCategory} from '../../api/index'
import { PAGE_SIZE,PRIMARY } from '../../config';
import {connect} from 'react-redux'
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'

// Category组件
function Category(props) {
  const [categoryList,setCategoryList] =useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openType,setOpenType] = useState('')
  const [loading,setLoading] = useState(true)
  const [categoryid,setCategoryid] =useState('')
  // 创建表单专用ref标识
  const [ FormRef ] = Form.useForm()

  // 请求分类列表数据
  const getCategoryList = async ()=>{
    const result = await reqCategoryList()
    setLoading(false)
    // console.log(result);
    const {data} = result
    
    // 将数据存入redux中
    props.saveCategory(data)
    // 将加工好的数据存入state中
    setCategoryList(data.map((item)=>{
      return {key:item._id,categoryName:item.name}
    }))
    // console.log(data);
  }
  // 生命周期
  useEffect(()=>{
    // 一上来，就请求商品分类列表
    getCategoryList()
  },[])
  // 定义列
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key:'categoryName'
    },
    {
      title: '操作',
      // dataIndex: 'categoryName',
      key:'categoryName',
      render:(item)=><Button type='link' style={{color:PRIMARY}} onClick={()=>{showUpdate(item)}}>修改分类</Button>,
      width:'25%',
      align: 'center'
    },
  ];
  // 点击弹窗添加的回调
  const showAdd = () => {
    setOpenType('add')
    setIsModalOpen(true);
  };
  // 点击弹窗修改的回调
  const showUpdate = (item) => {
    const {key,categoryName} = item
    setCategoryid(key)
    FormRef.setFieldsValue({categoryname:categoryName})
    setOpenType('update')
    setIsModalOpen(true);
  };
 
  // 点击弹窗ok的回调
  const handleOk = () => {
    FormRef.submit()
  };
  // 点击弹窗取消的回调
  const handleCancel = () => {
    setIsModalOpen(false);
    FormRef.resetFields()
  };

  // 添加分类的请求
  async function toAdd(values){
    const result = await reqAddCategory(values)
      const {data,code,msg} = result//获取请求返回值
      if(code === 0){
        message.success('添加数据成功')
        // 加工数据
        const obj ={}
        obj.key=data._id
        obj.categoryName=data.name
        // 深拷贝一个原始数组
        const arr=JSON.parse(JSON.stringify(categoryList))
        arr.unshift(obj) //将加工好的数据放进去
        setCategoryList(arr)//更新状态
        setIsModalOpen(false);//隐藏弹窗
        FormRef.resetFields()//重置表单
      }
      if (code === 2){
        message.error(msg,1)
      }
  }
   // 修改分类的请求
  async function toUpdate({categoryname}){
      // 发起修改请求
      const result = await reqUpdateCategory({categoryid,categoryname})
      // 拿到数据
      const {code,msg} = result
      // 成功的逻辑
      if(code === 0){
        message.success('更新商品分类成功',1)
        // 更新前端数据(直接操作本地数据，不需要再次发起请求获取数据，效率较高)
        const newarr=JSON.parse(JSON.stringify(categoryList))
        for(let item of newarr){
          if(item.key === categoryid){
            item.categoryName=categoryname
          }
        }
        setCategoryList(newarr)

        // 或者发起获取数据请求(网速慢的效率较低)
        // getCategoryList()

        setIsModalOpen(false);//隐藏弹窗
        FormRef.resetFields()//重置表单
      }else if(code === 2){
        message.error(msg)
      }else if(code === 3){
        message.warning('未修改')
        setIsModalOpen(false);//隐藏弹窗
        FormRef.resetFields()//重置表单
      }
  }
  // 提交表单的回调（触发表单的submit事件）
  const onFinish = async(values) => {
    // 1、获取用户的输入
    console.log('Received values of form: ',values);
    // 2、发起网络请求axios
    if(openType === 'add') toAdd(values)
    if(openType === 'update') toUpdate(values)
  };
  
  return (
    <div>
        <Card
          extra={<Button type='primary' onClick={showAdd} ><PlusOutlined />添加</Button>}
        >
          <Table loading={loading} bordered dataSource={categoryList} columns={columns} pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}/>
        </Card>
        <Modal title={openType === 'add'?'添加分类':'修改分类'} open={isModalOpen}  onOk={handleOk} onCancel={handleCancel} okText='确定' cancelText='取消'>
            <Form
              form={FormRef}
              name="modal-form"
              className="modal-form"
              initialValues={{
                remember: true
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="categoryname"
                rules={[
                  {
                    required: true,
                    message: '分类名必须输入',
                  },
                  {
                    max: 12,
                    message: '必须小于等于12位',
                  },
                  {
                    min: 1,
                    message: '必须大于等于1位',
                  }
                ]}
              >
                <Input placeholder="请输入分类名"  />
              </Form.Item>
            </Form>
        </Modal>
  </div>
  )
}

export default  connect(
  state => ({userInfo:state.userInfo}),
  {
    saveCategory:createSaveCategoryAction
  }
)(Category)