import React,{useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {connect} from 'react-redux'
import { Card,Button,List, message } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {PRIMARY} from '../../../config'
import {reqProdById,reqCategoryList} from '../../../api'
import { BASE_URL} from '../../../config'
import './index.scss'

function Detail(props) {
  
  const [prod_info,setProd_info] = useState([])
  const [isLonding,setIsLonding] = useState(true)
  const navigate = useNavigate()
  const {pid} = useParams()//pid为路由的参数名称，不可随意写

  // let prodDate
  // 根据商品id请求商品数据
  async function getProdById(id){
    // 给分类id转换成分类名
    let cateList = await  getCateByReq()
    let result =await reqProdById(id)
    const {code,data} = result
    if(code===0){
      //存入组件
      let arr=[
        {name:'商品名称',content:data.name},
        {name:'商品描述',content:data.desc},
        {name:'商品价格',content:'￥'+data.price},
        {name:'所属分类',content:cateList.find((item)=>{return item._id === data.categoryid})?.name},
        {name:'商品图片',content:data.imgs?.map((item)=>{
          return <img className='img' key={item} src={`${BASE_URL}/api1/upload/`+item}></img>
        })},
        {name:'商品详情',content:data.detail}
      ]
      setProd_info(arr)
    }else{
      message.error('获取数据失败')
    }
  }
  // 请求商品所有分类名称，存入状态
  async function getCateByReq(){
    let result = await reqCategoryList()
    const {data,code,msg} = result
    if(code===0){
      setIsLonding(false)
      return data
    }else{
      message.error(msg)
    }
  }
  // 生命周期
  useEffect(()=>{
    if(props.productList.length){
        const info = props.productList.find((item)=>{
        return String(item._id)===pid
      })
      const {categoryList} =props
      setIsLonding(false)
      //存入组件
      let arr=[
        {name:'商品名称',content:info.name},
        {name:'商品描述',content:info.desc},
        {name:'商品价格',content:'￥'+info.price},
        {name:'所属分类',content:categoryList.find((item)=>{return item._id === info.categoryid})?.name},
        {name:'商品图片',content:info.imgs?.map((item)=>{
          return <img className='img' key={item} src={`${BASE_URL}/api1/upload/`+item}></img>
        })},
        {name:'商品详情',content:info.detail}
      ]
      setProd_info(arr)
    }else{
      getProdById(pid)
    }
  },[])
  
  return (
    <Card className='detail'
    loading={isLonding} 
    title={
      <div className='left_title'>
        <Button type='link' className='left_button' onClick={()=>{navigate(-1)}}>
          <ArrowLeftOutlined style={{color:PRIMARY}} />
        </Button>
        <span>
          商品详情
        </span>
      </div>
    }>
     <List
      bordered
      grid={{
        gutter: 16,
        column: 1,
      }}
      split={true}
      dataSource={prod_info}
      
      renderItem={(item) => (
        <div>
          <List.Item >
          <div className='prod_item'>
          <span className='prod_name'>{item.name}：</span>{
            typeof item.content === 'object'?<span className='prod_content'>{item.content}</span>:
            <span className='prod_content' dangerouslySetInnerHTML={{__html:item.content}}></span>
          }
          </div>
        </List.Item>
        </div>
        
        
      )}
    />
    </Card>
  )
}

export default  connect(
  state => ({
    productList:state.productList,
    categoryList:state.categoryList
  }),
  {}
)(Detail)
