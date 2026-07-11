import { useState, useEffect } from 'react';
import { Button, Card, Modal, Input, Table, Form, message, Tree } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PRIMARY } from '../../config';
import Menu from '../../config/menu_config';
import { reqRoleList, reqAddRole, reqAuthRole } from '../../api';
import { useAppStore } from '../../store';

function Role() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [roleId, setRoleId] = useState('');
  const [Formref] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const username = useAppStore((s) => s.userInfo.user?.username);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    Formref.submit();
    setIsModalOpen(false);
  };

  const handleAuthOk = async () => {
    const result: any = await reqAuthRole({
      _id: roleId,
      menus: checkedKeys,
      auth_name: username,
    });
    const { code, data } = result;
    if (code === 0) {
      console.log(data);
      message.success('授权成功');
      getRoleList();
      setIsAuthOpen(false);
    } else {
      message.error('授权失败');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleAuthCancel = () => {
    setIsAuthOpen(false);
  };

  async function addRole(values: { roleName: string }) {
    const result: any = await reqAddRole(values);
    const { code } = result;
    if (code === 0) {
      message.success('添加成功');
      getRoleList();
    } else {
      message.error('添加失败');
    }
  }

  const onFinish = (values: { roleName: string }) => {
    console.log('Success:', values);
    addRole(values);
    Formref.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  async function getRoleList() {
    const result: any = await reqRoleList();
    const { code, data } = result;
    if (code === 0) {
      setRoleList(data);
    }
  }

  useEffect(() => {
    getRoleList();
  }, []);

  const onExpand = (expandedKeysValue: any) => {
    console.log('onExpand', expandedKeysValue);
  };

  const onCheck = (checkedKeysValue: any) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue as string[]);
  };

  function showAuth(id: string) {
    setRoleId(id);
    const result = roleList.find((item) => {
      return item._id === id;
    });
    setCheckedKeys(result.menus);
    setIsAuthOpen(true);
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
      render: (time: number) =>
        dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss'),
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      key: 'auth_time',
      render: (time: number) =>
        time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : '',
    },
    {
      title: '授权人',
      dataIndex: 'auth_name',
      key: 'auth_name',
    },
    {
      title: '操作',
      key: 'operate',
      render: ({ _id }: { _id: string }) => (
        <Button
          type="link"
          style={{ color: PRIMARY }}
          onClick={() => {
            showAuth(_id);
          }}
        >
          设置权限
        </Button>
      ),
    },
  ];

  const treeData = [
    {
      title: '平台',
      key: 'top',
      children: Menu as any,
    },
  ];

  return (
    <Card
      title={
        <div>
          <Button type="primary" onClick={showModal}>
            <PlusOutlined />
            新增角色
          </Button>
        </div>
      }
    >
      <Table dataSource={roleList} columns={columns} rowKey={'_id'} />;
      <Modal
        title="新增角色"
        okText="确认"
        cancelText="取消"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="addRole"
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
            <Input placeholder="请输入角色名" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="设置权限"
        okText="确认"
        cancelText="取消"
        open={isAuthOpen}
        onOk={handleAuthOk}
        onCancel={handleAuthCancel}
      >
        <Tree
          checkable
          onExpand={onExpand}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          defaultExpandAll={true}
          treeData={treeData}
        />
      </Modal>
    </Card>
  );
}

export default Role;
