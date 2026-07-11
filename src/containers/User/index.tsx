import { useState, useEffect } from 'react';
import { Button, Card, Modal, Input, Table, Form, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PAGE_SIZE, PRIMARY } from '../../config';
import { reqUserList, reqAddUser } from '../../api';
import dayjs from 'dayjs';

export default function User() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [FormRef] = Form.useForm();

  async function getUserList() {
    const result: any = await reqUserList();
    const { code, data } = result;
    if (code === 0) {
      setUserList(data.users);
      setRoleList(data.roles);
    } else {
      message.error('获取用户列表失败');
    }
  }
  useEffect(() => {
    getUserList();
  }, []);

  async function AddUser(values: Record<string, unknown>) {
    const result: any = await reqAddUser(values);
    const { code, data } = result;
    if (code === 0) {
      message.success('添加用户成功');
      setUserList([data, ...userList]);
      FormRef.resetFields();
      setIsModalOpen(false);
    } else {
      message.error('添加用户失败');
    }
  }

  const onFinish = (values: Record<string, unknown>) => {
    console.log('Success:', values);
    AddUser(values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showDelModal = () => {
    setIsDelModalOpen(true);
  };
  const handleOk = () => {
    FormRef.submit();
  };
  const handleDelOk = () => {
    setIsDelModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDelCancel = () => {
    setIsDelModalOpen(false);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'register_time',
      key: 'register_time',
      render: (time: number) =>
        dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss'),
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      key: 'role_id',
      render: (id: string) =>
        roleList.find((item) => {
          return item._id === id;
        }).name,
    },
    {
      title: '操作',
      key: 'do',
      render: () => {
        return (
          <div>
            <Button
              type="link"
              style={{ color: PRIMARY }}
              onClick={() => {
                showModal();
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              style={{ color: PRIMARY }}
              onClick={() => {
                showDelModal();
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Card
        title={
          <div>
            <Button
              type="primary"
              onClick={() => {
                showModal();
              }}
            >
              <PlusOutlined />
              新增用户
            </Button>
          </div>
        }
      >
        <Table
          dataSource={userList}
          pagination={{ pageSize: PAGE_SIZE }}
          columns={columns}
          rowKey={'_id'}
        />
      </Card>
      <Modal
        title="新增用户"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        style={{ maxWidth: '600px' }}
      >
        <Form
          name="updateUser"
          form={FormRef}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱!',
              },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role_id"
            rules={[
              {
                required: true,
                message: '必须选择一个角色',
              },
            ]}
          >
            <Select
              placeholder="请选择一个角色"
              options={roleList.map((item) => {
                return {
                  value: item._id,
                  label: item.name,
                };
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="删除"
        open={isDelModalOpen}
        onOk={handleDelOk}
        onCancel={handleDelCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>确定删除吗</p>
      </Modal>
    </div>
  );
}
