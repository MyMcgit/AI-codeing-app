import { useEffect, useState } from 'react';
import { Card, Button, Table, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  reqCategoryList,
  reqAddCategory,
  reqUpdateCategory,
} from '../../api/index';
import { PAGE_SIZE, PRIMARY } from '../../config';
import { useAppStore } from '../../store';

// Category组件
function Category() {
  const [categoryList, setCategoryList] = useState<
    { key: string; categoryName: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openType, setOpenType] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoryid, setCategoryid] = useState('');
  // 创建表单专用ref标识
  const [FormRef] = Form.useForm();
  const saveCategoryList = useAppStore((s) => s.saveCategoryList);

  // 请求分类列表数据
  const getCategoryList = async () => {
    const result: any = await reqCategoryList();
    setLoading(false);
    const { data } = result;

    // 将数据存入store中
    saveCategoryList(data);
    // 将加工好的数据存入state中
    setCategoryList(
      data.map((item: any) => {
        return { key: item._id, categoryName: item.name };
      })
    );
  };
  // 生命周期
  useEffect(() => {
    // 一上来，就请求商品分类列表
    getCategoryList();
  }, []);

  // 定义列
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '操作',
      key: 'action',
      render: (item: { key: string; categoryName: string }) => (
        <Button
          type="link"
          style={{ color: PRIMARY }}
          onClick={() => {
            showUpdate(item);
          }}
        >
          修改分类
        </Button>
      ),
      width: '25%',
      align: 'center' as const,
    },
  ];

  // 点击弹窗添加的回调
  const showAdd = () => {
    setOpenType('add');
    setIsModalOpen(true);
  };
  // 点击弹窗修改的回调
  const showUpdate = (item: { key: string; categoryName: string }) => {
    const { key, categoryName } = item;
    setCategoryid(key);
    FormRef.setFieldsValue({ categoryname: categoryName });
    setOpenType('update');
    setIsModalOpen(true);
  };

  // 点击弹窗ok的回调
  const handleOk = () => {
    FormRef.submit();
  };
  // 点击弹窗取消的回调
  const handleCancel = () => {
    setIsModalOpen(false);
    FormRef.resetFields();
  };

  // 添加分类的请求
  async function toAdd(values: { categoryname: string }) {
    const result: any = await reqAddCategory(values);
    const { data, code, msg } = result;
    if (code === 0) {
      message.success('添加数据成功');
      const obj: { key: string; categoryName: string } = {
        key: data._id,
        categoryName: data.name,
      };
      const arr = JSON.parse(JSON.stringify(categoryList));
      arr.unshift(obj);
      setCategoryList(arr);
      setIsModalOpen(false);
      FormRef.resetFields();
    }
    if (code === 2) {
      message.error(msg, 1);
    }
  }
  // 修改分类的请求
  async function toUpdate(values: { categoryname: string }) {
    const { categoryname } = values;
    const result: any = await reqUpdateCategory({ categoryid, categoryname });
    const { code, msg } = result;
    if (code === 0) {
      message.success('更新商品分类成功', 1);
      const newarr = JSON.parse(JSON.stringify(categoryList));
      for (const item of newarr) {
        if (item.key === categoryid) {
          item.categoryName = categoryname;
        }
      }
      setCategoryList(newarr);
      setIsModalOpen(false);
      FormRef.resetFields();
    } else if (code === 2) {
      message.error(msg);
    } else if (code === 3) {
      message.warning('未修改');
      setIsModalOpen(false);
      FormRef.resetFields();
    }
  }

  // 提交表单的回调
  const onFinish = async (values: { categoryname: string }) => {
    console.log('Received values of form: ', values);
    if (openType === 'add') toAdd(values);
    if (openType === 'update') toUpdate(values);
  };

  return (
    <div>
      <Card
        extra={
          <Button type="primary" onClick={showAdd}>
            <PlusOutlined />
            添加
          </Button>
        }
      >
        <Table
          loading={loading}
          bordered
          dataSource={categoryList}
          columns={columns}
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
        />
      </Card>
      <Modal
        title={openType === 'add' ? '添加分类' : '修改分类'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={FormRef}
          name="modal-form"
          className="modal-form"
          initialValues={{
            remember: true,
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
              },
            ]}
          >
            <Input placeholder="请输入分类名" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Category;
