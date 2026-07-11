import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  reqCategoryList,
  reqAddProduct,
  reqProdById,
  reqUpdateProduct,
} from '../../../api';
import { Card, Form, Input, Button, message, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PRIMARY, BASE_URL } from '../../../config';
import PictureWall from './PictureWall';
import RichTextEditor from './RichTextEditor';
import { useAppStore } from '../../../store';

// AddUpdate组件
function AddUpdate() {
  const [categoryList, setCategoryList] = useState<
    { value: string; label: string }[]
  >([]);
  const [FormRef] = Form.useForm();
  const editor = React.createRef<any>();
  const picwall = React.createRef<any>();
  const [preimgs, setPreImgs] = useState<string[]>([]);
  const [richtext, setrichtext] = useState('');
  const { pid } = useParams<{ pid: string }>();
  const navigate = useNavigate();

  const productList = useAppStore((s) => s.productList);
  const categoryListFromRedux = useAppStore((s) => s.categoryList);

  // 获取分类列表请求
  async function getCategoryList() {
    const result: any = await reqCategoryList();
    const { code, data, msg } = result;
    if (code === 0) {
      const newData = data.map((item: any) => {
        const obj = { value: item._id, label: item.name };
        return obj;
      });
      setCategoryList(newData);
    } else {
      message.error(msg);
    }
  }

  // 回显数据，统一封装函数
  function fn(data: any, picwall: any, editor: any) {
    const { name, desc, price, categoryid, imgs, detail } = data;
    FormRef.setFieldsValue({
      catename: name,
      desc: desc,
      price: price,
      category: categoryid,
    });
    const arr = imgs.map((item: string) => {
      return {
        uid: Math.random().toString(),
        name: item,
        status: 'done',
        url: BASE_URL + '/api1/upload/' + item,
      };
    });
    picwall.setFileList(arr);
    editor.setHtml(detail);
    setPreImgs(imgs);
    setrichtext(detail);
  }

  // 获取商品信息通过id
  async function getProduct() {
    const editorcurrent = editor.current;
    const picwallcurrent = picwall.current;
    const result: any = await reqProdById(pid!);
    const { code, data } = result;
    if (code === 0) {
      fn(data, picwallcurrent, editorcurrent);
    } else {
      message.error('获取数据失败');
    }
  }

  // 生命周期
  useEffect(() => {
    if (categoryListFromRedux.length) {
      const newData = categoryListFromRedux.map((item: any) => {
        const obj = { value: item._id, label: item.name };
        return obj;
      });
      setCategoryList(newData);
    } else {
      getCategoryList();
    }
    // 如果有id说明进入了修改商品页面
    if (pid) {
      if (productList.length) {
        const result = productList.find((item: any) => {
          return item._id === Number(pid);
        });
        if (result) {
          fn(result, picwall.current, editor.current);
        }
      } else {
        getProduct();
      }
    }
  }, []);

  // 提交表单的回调
  const onFinish = async (values: any) => {
    values.imgs = preimgs;
    values.detail = richtext;
    console.log('Received values of form: ', values);
    let result: any;
    console.log(values);
    if (pid) {
      values.id = pid;
      result = await reqUpdateProduct(values);
    } else {
      result = await reqAddProduct(values);
    }
    const { code } = result;
    if (code === 0) {
      message.success(pid ? '修改商品成功' : '新增商品成功');
      navigate('/admin/prod_about/product');
    } else {
      message.error('新增商品失败');
    }
  };

  return (
    <Card
      title={
        <div className="left_title">
          <Button
            type="link"
            className="left_button"
            onClick={() => {
              navigate(-1);
            }}
            style={{ fontSize: '20px' }}
          >
            <ArrowLeftOutlined style={{ color: PRIMARY }} />
          </Button>
          <span style={{ fontSize: '20px' }}>
            {pid ? '修改商品' : '新增商品'}
          </span>
        </div>
      }
    >
      <Form
        form={FormRef}
        name="addUpdate-form"
        className="addUpdate-form"
        labelCol={{ md: 2 }}
        wrapperCol={{ md: 7 }}
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
          <Input placeholder="商品名称" />
        </Form.Item>
        <Form.Item
          label="商品描述"
          name="desc"
          rules={[
            {
              required: true,
              message: '请输入商品描述',
            },
          ]}
        >
          <Input placeholder="商品描述" />
        </Form.Item>
        <Form.Item
          label="商品价格"
          name="price"
          rules={[
            {
              required: true,
              message: '请输入商品价格',
            },
          ]}
        >
          <Input prefix="￥" suffix="元" type="number" placeholder="商品价格" />
        </Form.Item>
        <Form.Item
          label="商品分类"
          name="category"
          rules={[
            {
              required: true,
              message: '请输入商品分类',
            },
          ]}
        >
          <Select options={categoryList} placeholder="请选择分类" />
        </Form.Item>
        <Form.Item label="商品图片" wrapperCol={{ md: 17 }}>
          <PictureWall
            ref={picwall}
            preimgs={preimgs}
            setPreImgs={setPreImgs}
          />
        </Form.Item>
        <Form.Item label="商品详情" name="detail" wrapperCol={{ md: 17 }}>
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
  );
}

export default AddUpdate;
