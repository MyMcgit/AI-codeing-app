<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import dayjs from 'dayjs';
import { PAGE_SIZE, PRIMARY } from '@/config';
import { reqUserList, reqAddUser } from '@/api';

const userList = ref<any[]>([]);
const roleList = ref<any[]>([]);
const isModalOpen = ref(false);
const formRef = ref<any>();

const columns = [
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  {
    title: '注册时间',
    dataIndex: 'register_time',
    key: 'register_time',
  },
  {
    title: '所属角色',
    dataIndex: 'role_id',
    key: 'role_id',
  },
  {
    title: '操作',
    key: 'do',
  },
];

async function getUserList() {
  const result: any = await reqUserList();
  const { code, data } = result;
  if (code === 0) {
    userList.value = data.users;
    roleList.value = data.roles;
  } else {
    message.error('获取用户列表失败');
  }
}

onMounted(() => {
  getUserList();
});

function showModal() {
  isModalOpen.value = true;
}

function handleOk() {
  formRef.value?.submit();
}

function handleCancel() {
  isModalOpen.value = false;
}

async function addUser(values: Record<string, unknown>) {
  const result: any = await reqAddUser(values);
  const { code, data } = result;
  if (code === 0) {
    message.success('添加用户成功');
    userList.value = [data, ...userList.value];
    formRef.value?.resetFields();
    isModalOpen.value = false;
  } else {
    message.error('添加用户失败');
  }
}

function onFinish(values: Record<string, unknown>) {
  addUser(values);
}
</script>

<template>
  <div>
    <a-card>
      <template #title>
        <a-button type="primary" @click="showModal">
          <PlusOutlined />
          新增用户
        </a-button>
      </template>

      <a-table
        :data-source="userList"
        :columns="columns"
        :pagination="{ pageSize: PAGE_SIZE }"
        row-key="_id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'register_time'">
            {{ record.register_time ? dayjs(record.register_time).format('YYYY年 MM月DD日 HH:mm:ss') : '' }}
          </template>
          <template v-else-if="column.key === 'role_id'">
            {{ roleList.find((r: any) => r._id === record.role_id)?.name }}
          </template>
          <template v-else-if="column.key === 'do'">
            <a-button type="link" :style="{ color: PRIMARY }">修改</a-button>
            <a-button type="link" :style="{ color: PRIMARY }">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      title="新增用户"
      :open="isModalOpen"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="确定"
      cancel-text="取消"
      :width="600"
    >
      <a-form
        ref="formRef"
        name="updateUser"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        @finish="onFinish"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password placeholder="请输入密码" />
        </a-form-item>
        <a-form-item
          label="手机号"
          name="phone"
          :rules="[{ required: true, message: '请输入手机号!' }]"
        >
          <a-input placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[{ required: true, message: '请输入邮箱!' }]"
        >
          <a-input placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item
          label="角色"
          name="role_id"
          :rules="[{ required: true, message: '必须选择一个角色' }]"
        >
          <a-select
            placeholder="请选择一个角色"
            :options="roleList.map((r: any) => ({ value: r._id, label: r.name }))"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
