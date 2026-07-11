import React,{useState,useEffect} from 'react'
import { useNavigate,useOutlet} from 'react-router-dom'
import { Button, Card, Select,Input,Table, message} from 'antd'
import {PlusOutlined,SearchOutlined} from '@ant-design/icons'
import {PRIMARY,PAGE_SIZE} from '../../config'
import {reqProductList,reqUPdateProdStatus,reqSearchProduct} from '../../api'
import {connect} from 'react-redux'
import { createSaveProductAction } from '../../redux/action_creators/product_action'


 function Product(props) {

  const [productData,setProductData] =useState('')
  const [select,setSelect] = useState('productName')
  const [inputValue,setInputValue] = useState('')
  const [isSearch,setIsSearch] = useState('')

  const navigate = useNavigate()
  // 请求商品列表方法
  async function getReqProductList(number=1,search){
    let result
    if(isSearch||search){
      result =await reqSearchProduct(number,PAGE_SIZE,select,inputValue)
    }else{
      result =await reqProductList(number,PAGE_SIZE)
    }
    const {code,data} = result
    if(code === 0){
      // 将数据存入状态里
      setProductData(data)
      // 将数据存入redux里
      props.saveProduct(data.list)
    }else{
      message.error('获取商品列表失败')
    }
  }
  // 生命周期
  useEffect(()=>{
    getReqProductList()
  },[])
  // 更新商品状态
  async function updateProdStatus(_id,status){
    console.log(_id);

    // 给商品状态取反
    status=status===1?2:1

    const result =await reqUPdateProdStatus(_id,status)
    console.log(result);
    const {code} = result
    if(code === 0){
      message.success('更新商品状态成功')
      // 采用本地修改方法（效率高）
      let newobj=JSON.parse(JSON.stringify(productData))
      for(let item of newobj.list){
        if(item._id===_id){
          item.status=status
          break
        }
      }
      setProductData(newobj)
    }else{
      message.error("更新商品状态失败")
    }
  }

  // 搜索方法
  function search(){
    setIsSearch(true)
    // 调用获取列表方法，获取列表方法与搜索列表方法混合到一起了
    getReqProductList(1,true)
  }
  // 定义列
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width:'18%'
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '价格',
      dataIndex:'price',
      key: 'price',
      align:'center',
      width:'8%',
      render:(price)=> '￥'+price
    },
    {
      title: '状态',
      key: 'status',
      align:'center',
      width:'9%',
      render:({status,_id})=> {
        return(
          <div>
            <Button 
            type={'primary'} 
            danger={status===1?true:false}
            onClick={()=>{updateProdStatus(_id,status)}}
            >
              {status===1?'下架':'上架'}
            </Button><br />
            {status===1?'在售':'已下架'}
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'opera',
      align:'center',
      width:'10%',
      render:({_id})=> {
        return(
          <div>
            <Button onClick={()=>{showDetail(_id)}} type='link' style={{color:PRIMARY}}>
              详情
            </Button><br />
            <Button onClick={()=>{showUpdate(_id)}} type='link' style={{color:PRIMARY}}>
              修改
            </Button>
          </div>
        )
      }
    },
  ];
  // 添加商品
  function showAdd(){
    navigate('addupdate')
  }
  // 详情
  function showDetail(id){
    navigate('detail/'+id)
  }
  // 修改商品
  function showUpdate(id){
    navigate('addupdate/'+id)
  }
  const outlet = useOutlet()
  if(useOutlet()){
    return outlet
  }
  return (
    <Card 
      title={ 
        <div>
            <Select
              defaultValue="productName"
              onChange={(value)=>{setSelect(value)}}
              options={[
                {
                  value: 'productName',
                  label: '按名称搜索',
                },
                {
                  value: 'productDesc',
                  label: '按描述搜索',
                }
              ]}
            />
            <Input 
            style={{width:'20%',margin:'0 10px'}} 
            placeholder='请输入关键字'
            onChange={(event)=>{setInputValue(event.target.value)}}
            allowClear
            />
            <Button type='primary' onClick={search}><SearchOutlined />搜索</Button>
        </div>
        }
        extra={ <Button type='primary' onClick={showAdd}><PlusOutlined />添加商品</Button> }
      >
        <Table 
          dataSource={productData.list} 
          columns={columns} 
          bordered 
          rowKey='_id'
          pagination={{
            pageSize:PAGE_SIZE,
            total:productData.total,
            current:productData.pageNum,
            onChange:getReqProductList
          }}
        />
    </Card>
  )
}

export default  connect(
  state => ({}),
  {
    saveProduct:createSaveProductAction
  }
)(Product)