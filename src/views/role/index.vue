<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import dayjs from 'dayjs';
import { PRIMARY } from '@/config';
import menuConfig from '@/config/menu';
import { reqRoleList, reqAddRole, reqAuthRole } from '@/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const roleList = ref<any[]>([]);
const isModalOpen = ref(false);
const isAuthOpen = ref(false);
const roleId = ref('');
const checkedKeys = ref<string[]>([]);
const formRef = ref<any>();

const columns = [
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '授权时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
  },
  {
    title: '授权人',
    dataIndex: 'auth_name',
    key: 'auth_name',
  },
  {
    title: '操作',
    key: 'operate',
  },
];

const treeData = ref<any[]>([
  {
    title: '平台',
    key: 'top',
    children: menuConfig.map((item) => ({
      title: item.title,
      key: item.key,
      children: item.children?.map((child) => ({
        title: child.title,
        key: child.key,
      })),
    })),
  },
]);

async function getRoleList() {
  const result: any = await reqRoleList();
  const { code, data } = result;
  if (code === 0) {
    roleList.value = data;
  }
}

onMounted(() => {
  getRoleList();
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

async function addRole(values: { roleName: string }) {
  const result: any = await reqAddRole(values);
  if (result.code === 0) {
    message.success('添加成功');
    getRoleList();
    isModalOpen.value = false;
    formRef.value?.resetFields();
  } else {
    message.error('添加失败');
  }
}

function onFinish(values: { roleName: string }) {
  addRole(values);
}

function showAuth(role: any) {
  roleId.value = role._id;
  checkedKeys.value = role.menus || [];
  isAuthOpen.value = true;
}

async function handleAuthOk() {
  const result: any = await reqAuthRole({
    _id: roleId.value,
    menus: checkedKeys.value,
    auth_name: authStore.user?.username,
  });
  if (result.code === 0) {
    message.success('授权成功');
    getRoleList();
    isAuthOpen.value = false;
  } else {
    message.error('授权失败');
  }
}
</script>

<template>
  <a-card>
    <template #title>
      <a-button type="primary" @click="showModal">
        <PlusOutlined />
        新增角色
      </a-button>
    </template>

    <a-table :data-source="roleList" :columns="columns" row-key="_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'create_time'">
          {{ record.create_time ? dayjs(record.create_time).format('YYYY年 MM月DD日 HH:mm:ss') : '' }}
        </template>
        <template v-else-if="column.key === 'auth_time'">
          {{ record.auth_time ? dayjs(record.auth_time).format('YYYY年 MM月DD日 HH:mm:ss') : '' }}
        </template>
        <template v-else-if="column.key === 'operate'">
          <a-button type="link" :style="{ color: PRIMARY }" @click="showAuth(record)">
            设置权限
          </a-button>
        </template>
      </template>
    </a-table>

    <!-- 新增角色弹窗 -->
    <a-modal
      title="新增角色"
      :open="isModalOpen"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="确认"
      cancel-text="取消"
    >
      <a-form
        ref="formRef"
        name="addRole"
        @finish="onFinish"
      >
        <a-form-item
          label="角色名"
          name="roleName"
          :rules="[{ required: true, message: '请输入角色名!' }]"
        >
          <a-input placeholder="请输入角色名" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 设置权限弹窗 -->
    <a-modal
      title="设置权限"
      :open="isAuthOpen"
      @ok="handleAuthOk"
      @cancel="isAuthOpen = false"
      ok-text="确认"
      cancel-text="取消"
    >
      <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="treeData"
        default-expand-all
      />
    </a-modal>
  </a-card>
</template>
