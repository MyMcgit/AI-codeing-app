import { useState, useEffect } from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { Button, Card, Select, Input, Table, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PRIMARY, PAGE_SIZE } from '../../config';
import {
  reqProductList,
  reqUPdateProdStatus,
  reqSearchProduct,
} from '../../api';
import { useAppStore } from '../../store';

function Product() {
  const [productData, setProductData] = useState<any>('');
  const [select, setSelect] = useState('productName');
  const [inputValue, setInputValue] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();
  const saveProductList = useAppStore((s) => s.saveProductList);

  // 请求商品列表方法
  async function getReqProductList(number = 1, search?: boolean) {
    let result: any;
    if (isSearch || search) {
      result = await reqSearchProduct(number, PAGE_SIZE, select, inputValue);
    } else {
      result = await reqProductList(number, PAGE_SIZE);
    }
    const { code, data } = result;
    if (code === 0) {
      setProductData(data);
      saveProductList(data.list);
    } else {
      message.error('获取商品列表失败');
    }
  }

  // 生命周期
  useEffect(() => {
    getReqProductList();
  }, []);

  // 更新商品状态
  async function updateProdStatus(_id: string, status: number) {
    console.log(_id);
    status = status === 1 ? 2 : 1;

    const result: any = await reqUPdateProdStatus(_id, status);
    console.log(result);
    const { code } = result;
    if (code === 0) {
      message.success('更新商品状态成功');
      const newobj = JSON.parse(JSON.stringify(productData));
      for (const item of newobj.list) {
        if (item._id === _id) {
          item.status = status;
          break;
        }
      }
      setProductData(newobj);
    } else {
      message.error('更新商品状态失败');
    }
  }

  // 搜索方法
  function search() {
    setIsSearch(true);
    getReqProductList(1, true);
  }

  // 定义列
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: '18%',
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center' as const,
      width: '8%',
      render: (price: number) => '￥' + price,
    },
    {
      title: '状态',
      key: 'status',
      align: 'center' as const,
      width: '9%',
      render: ({ status, _id }: { status: number; _id: string }) => {
        return (
          <div>
            <Button
              type={'primary'}
              danger={status === 1 ? true : false}
              onClick={() => {
                updateProdStatus(_id, status);
              }}
            >
              {status === 1 ? '下架' : '上架'}
            </Button>
            <br />
            {status === 1 ? '在售' : '已下架'}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'opera',
      align: 'center' as const,
      width: '10%',
      render: ({ _id }: { _id: string }) => {
        return (
          <div>
            <Button
              onClick={() => {
                showDetail(_id);
              }}
              type="link"
              style={{ color: PRIMARY }}
            >
              详情
            </Button>
            <br />
            <Button
              onClick={() => {
                showUpdate(_id);
              }}
              type="link"
              style={{ color: PRIMARY }}
            >
              修改
            </Button>
          </div>
        );
      },
    },
  ];

  function showAdd() {
    navigate('addupdate');
  }
  function showDetail(id: string) {
    navigate('detail/' + id);
  }
  function showUpdate(id: string) {
    navigate('addupdate/' + id);
  }

  const outlet = useOutlet();
  if (useOutlet()) {
    return outlet;
  }
  return (
    <Card
      title={
        <div>
          <Select
            defaultValue="productName"
            onChange={(value) => {
              setSelect(value);
            }}
            options={[
              {
                value: 'productName',
                label: '按名称搜索',
              },
              {
                value: 'productDesc',
                label: '按描述搜索',
              },
            ]}
          />
          <Input
            style={{ width: '20%', margin: '0 10px' }}
            placeholder="请输入关键字"
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            allowClear
          />
          <Button type="primary" onClick={search}>
            <SearchOutlined />
            搜索
          </Button>
        </div>
      }
      extra={
        <Button type="primary" onClick={showAdd}>
          <PlusOutlined />
          添加商品
        </Button>
      }
    >
      <Table
        dataSource={productData.list}
        columns={columns}
        bordered
        rowKey="_id"
        pagination={{
          pageSize: PAGE_SIZE,
          total: productData.total,
          current: productData.pageNum,
          onChange: (page: number) => getReqProductList(page),
        }}
      />
    </Card>
  );
}

export default Product;
