<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '@/api';
import { useAppStore } from '@/stores/app';
import { PAGE_SIZE, PRIMARY } from '@/config';

const appStore = useAppStore();

const categoryList = ref<{ key: string; categoryName: string }[]>([]);
const isModalOpen = ref(false);
const openType = ref<'add' | 'update'>('add');
const loading = ref(true);
const categoryid = ref('');
const formRef = ref<any>();

const columns = [
  { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
  {
    title: '操作',
    key: 'action',
    width: '25%',
    align: 'center' as const,
  },
];

async function getCategoryList() {
  const result: any = await reqCategoryList();
  loading.value = false;
  const { data } = result;
  appStore.setCategoryList(data);
  categoryList.value = data.map((item: any) => ({
    key: item._id,
    categoryName: item.name,
  }));
}

onMounted(() => {
  getCategoryList();
});

function showAdd() {
  openType.value = 'add';
  isModalOpen.value = true;
}

function showUpdate(item: { key: string; categoryName: string }) {
  categoryid.value = item.key;
  formRef.value?.setFieldsValue({ categoryname: item.categoryName });
  openType.value = 'update';
  isModalOpen.value = true;
}

function handleOk() {
  formRef.value?.submit();
}

function handleCancel() {
  isModalOpen.value = false;
  formRef.value?.resetFields();
}

async function toAdd(values: { categoryname: string }) {
  const result: any = await reqAddCategory(values);
  const { data, code, msg } = result;
  if (code === 0) {
    message.success('添加数据成功');
    const arr = JSON.parse(JSON.stringify(categoryList.value));
    arr.unshift({ key: data._id, categoryName: data.name });
    categoryList.value = arr;
    isModalOpen.value = false;
    formRef.value?.resetFields();
  } else if (code === 2) {
    message.error(msg, 1);
  }
}

async function toUpdate(values: { categoryname: string }) {
  const result: any = await reqUpdateCategory({
    categoryid: categoryid.value,
    categoryname: values.categoryname,
  });
  const { code, msg } = result;
  if (code === 0) {
    message.success('更新商品分类成功', 1);
    const newarr = JSON.parse(JSON.stringify(categoryList.value));
    for (const item of newarr) {
      if (item.key === categoryid.value) {
        item.categoryName = values.categoryname;
      }
    }
    categoryList.value = newarr;
    isModalOpen.value = false;
    formRef.value?.resetFields();
  } else if (code === 2) {
    message.error(msg);
  } else if (code === 3) {
    message.warning('未修改');
    isModalOpen.value = false;
    formRef.value?.resetFields();
  }
}

function onFinish(values: { categoryname: string }) {
  if (openType.value === 'add') toAdd(values);
  else toUpdate(values);
}
</script>

<template>
  <div>
    <a-card>
      <template #extra>
        <a-button type="primary" @click="showAdd">
          <PlusOutlined />
          添加
        </a-button>
      </template>
      <a-table
        :loading="loading"
        bordered
        :data-source="categoryList"
        :columns="columns"
        :pagination="{ pageSize: PAGE_SIZE, showQuickJumper: true }"
        row-key="key"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" :style="{ color: PRIMARY }" @click="showUpdate(record)">
              修改分类
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      :title="openType === 'add' ? '添加分类' : '修改分类'"
      :open="isModalOpen"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-form
        ref="formRef"
        name="modal-form"
        @finish="onFinish"
      >
        <a-form-item
          name="categoryname"
          :rules="[
            { required: true, message: '分类名必须输入' },
            { max: 12, message: '必须小于等于12位' },
            { min: 1, message: '必须大于等于1位' },
          ]"
        >
          <a-input placeholder="请输入分类名" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
