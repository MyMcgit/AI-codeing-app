import React,{useState,useEffect} from 'react'
import {useNavigate ,useParams} from 'react-router-dom'
import {connect} from 'react-redux'
import {reqCategoryList,reqAddProduct,reqProdById,reqUpdateProduct} from '../../../api'
import { Card,Form,Input,Button,message,Select} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {PRIMARY} from '../../../config'
import PictureWall from './PictureWall'
import RichTextEditor from './RichTextEditor'
import { BASE_URL } from '../../../config'


// AddUpdate组件
function AddUpdate(props) {
  const [categoryList,setCategoryList] = useState([])
  const [ FormRef ] = Form.useForm()
  const editor = React.createRef(null)
  const picwall =React.createRef(null)
  // 照片墙信息
  const [preimgs,setPreImgs] = useState([])
  // 富文本信息
  const [richtext,setrichtext] = useState('')
  // 获取路径中的商品id
  const {pid} = useParams()
  // 获取分类列表请求
  async function getCategoryList(){
    let result = await reqCategoryList()
    const {code,data,msg} =result
    if(code === 0){
      let newData = data.map((item)=>{
        let obj = {}
        obj.value =item._id
        obj.label =item.name
        return  obj
      })
      setCategoryList(newData)
    }else{
      message.error(msg)
    }
  }
  // 回显数据，统一封装函数
  function fn(data,picwall,editor){
    const {name,desc,price,categoryid,imgs,detail} = data
    FormRef.setFieldsValue({
      catename:name,
      desc:desc,
      price:price,
      category:categoryid,
    })
    let arr= imgs.map((item)=>{
          return {
            uid: Math.random().toString(),
            name: item,
            status: 'done',
            url: BASE_URL+'/api1/upload/'+item
          }
        })
    picwall.setFileList(arr)
    editor.setHtml(detail)
    // 上传时，若未修改照片墙或富文本，则表单不会收集到数据，需要手动输入
    setPreImgs(imgs)
    setrichtext(detail)
  }
  // 获取商品信息通过id（在页面被刷新，商品数据丢失时调用）
  async function getProduct(){
    const editorcurrent = editor.current
    const picwallcurrent= picwall.current
    const result = await reqProdById(pid)
    const {code,data} = result
    if(code === 0){
      // 回显数据
      fn(data,picwallcurrent,editorcurrent)
    }else{
      message.error('获取数据失败')
    }
  }
  // 生命周期
  useEffect(()=>{
    // 初始化分类列表
    const {categoryListFromRedux,productList}=props
    if(categoryListFromRedux.length){
      let newData = categoryListFromRedux.map((item)=>{
        let obj = {}
        obj.value =item._id
        obj.label =item.name
        return  obj
      })
      // console.log(newData);
      setCategoryList(newData)
    }else{
      getCategoryList()
      // 发起请求
      // console.log('请求');
    }
    // 如果有id说明进入了修改商品页面
    if(pid){
      // 拿到id去和redux里的productList数据比对
        if(productList.length){
            let result = productList.find((item)=>{
            return item._id === pid*1
            })
            // 回显数据
            fn(result,picwall.current,editor.current)
        }else{
          // 请求数据
          getProduct()
        }
      }
  },[])
  const navigate = useNavigate()
  // 提交表单的回调（触发表单的submit事件）
  const onFinish =async (values) => {
    values.imgs=preimgs
    values.detail=richtext
    // 1、获取用户的输入
    console.log('Received values of form: ',values);
    // 2、发起网络请求axios（需要判断是新增还是修改商品）
    let result
    console.log(values);
    if(pid){
      values.id=pid
      result = await reqUpdateProduct(values)
    }else{
      result = await reqAddProduct(values)
    }
    const {code} = result
    if(code === 0){
      message.success(pid?'修改商品成功':'新增商品成功')
      navigate('/admin/prod_about/product')
    }else{
      message.error('新增商品失败')
    }
  };
  return (
    <Card
    title={
      <div className='left_title'>
        <Button type='link' className='left_button' onClick={()=>{navigate(-1)}} style={{fontSize: '20px'}}>
          <ArrowLeftOutlined style={{color:PRIMARY}} />
        </Button>
        <span style={{fontSize: '20px'}}>
          {pid?'修改商品':'新增商品'}
        </span>
      </div>
    }>
      <Form
        form={FormRef}
        name="addUpdate-form"
        className="addUpdate-form"
        // layout="vertical"
        labelCol={{md:2}}
        wrapperCol={{md:7}}
        onFinish={onFinish}
      >
        <Form.Item
          label="商品名称"
          name="catename"
          rules={[
            {
              required: true,
              message: '请输入商品名称',
            },
          ]}
        >
          <Input placeholder='商品名称' />
        </Form.Item>
        <Form.Item
          label="商品描述"
          name="desc"
          rules={[
            {
              required: true,
              message: "请输入商品描述",
            },
          ]}
        >
          <Input placeholder='商品描述'/>
        </Form.Item>
        <Form.Item
          label="商品价格"
          name="price"
          rules={[
            {
              required: true,
              message: "请输入商品价格",
            },
          ]}
        >
          <Input prefix="￥" suffix="元"  type='number' placeholder='商品价格'/>
        </Form.Item>
        <Form.Item
          label="商品分类"
          name="category"
          rules={[
            {
              required: true,
              message: "请输入商品分类",
            },
          ]}
        >
          <Select
            options={categoryList}
            placeholder='请选择分类'
          />
        </Form.Item>
        <Form.Item
          label="商品图片"
          // name="imgs"
          wrapperCol={{md:17}}
        >
          <PictureWall ref={picwall} preimgs={preimgs} setPreImgs={setPreImgs} />
        </Form.Item>
        <Form.Item
          label="商品详情"
          name="detail"
          wrapperCol={{md:17}}
        >
          <RichTextEditor ref={editor} setrichtext={setrichtext} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default  connect(
  state => ({
    productList:state.productList,
    categoryListFromRedux:state.categoryList
  }),
  {}
)(AddUpdate)
