<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { PRIMARY, PAGE_SIZE } from '@/config';
import { reqProductList, reqUPdateProdStatus, reqSearchProduct } from '@/api';
import { useAppStore } from '@/stores/app';

const router = useRouter();
const appStore = useAppStore();

const productData = ref<any>('');
const select = ref('productName');
const inputValue = ref('');
const isSearch = ref(false);

async function getReqProductList(number = 1, search?: boolean) {
  let result: any;
  if (isSearch.value || search) {
    result = await reqSearchProduct(number, PAGE_SIZE, select.value, inputValue.value);
  } else {
    result = await reqProductList(number, PAGE_SIZE);
  }
  const { code, data } = result;
  if (code === 0) {
    productData.value = data;
    appStore.setProductList(data.list);
  } else {
    message.error('获取商品列表失败');
  }
}

onMounted(() => {
  getReqProductList();
});

async function updateProdStatus(_id: string, status: number) {
  const newStatus = status === 1 ? 2 : 1;
  const result: any = await reqUPdateProdStatus(_id, newStatus);
  if (result.code === 0) {
    message.success('更新商品状态成功');
    const newobj = JSON.parse(JSON.stringify(productData.value));
    for (const item of newobj.list) {
      if (item._id === _id) {
        item.status = newStatus;
        break;
      }
    }
    productData.value = newobj;
  } else {
    message.error('更新商品状态失败');
  }
}

function search() {
  isSearch.value = true;
  getReqProductList(1, true);
}

function showAdd() {
  router.push('addupdate');
}

function showDetail(id: string) {
  router.push('detail/' + id);
}

function showUpdate(id: string) {
  router.push('addupdate/' + id);
}

const columns = [
  { title: '商品名称', dataIndex: 'name', key: 'name', width: '18%' },
  { title: '商品描述', dataIndex: 'desc', key: 'desc' },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    align: 'center' as const,
    width: '8%',
  },
  {
    title: '状态',
    key: 'status',
    align: 'center' as const,
    width: '9%',
  },
  {
    title: '操作',
    key: 'opera',
    align: 'center' as const,
    width: '10%',
  },
];
</script>

<template>
  <!-- 有子路由时渲染子路由 -->
  <router-view v-if="$route.matched.length > 2" />
  <a-card v-else>
    <template #title>
      <div>
        <a-select
          v-model:value="select"
          style="width: 140px"
          :options="[
            { value: 'productName', label: '按名称搜索' },
            { value: 'productDesc', label: '按描述搜索' },
          ]"
        />
        <a-input
          v-model:value="inputValue"
          style="width: 20%; margin: 0 10px"
          placeholder="请输入关键字"
          allow-clear
        />
        <a-button type="primary" @click="search">
          <SearchOutlined />
          搜索
        </a-button>
      </div>
    </template>
    <template #extra>
      <a-button type="primary" @click="showAdd">
        <PlusOutlined />
        添加商品
      </a-button>
    </template>

    <a-table
      :data-source="productData.list"
      :columns="columns"
      bordered
      row-key="_id"
      :pagination="{
        pageSize: PAGE_SIZE,
        total: productData.total,
        current: productData.pageNum,
        onChange: (page: number) => getReqProductList(page),
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">
          ￥{{ record.price }}
        </template>
        <template v-else-if="column.key === 'status'">
          <div>
            <a-button
              type="primary"
              :danger="record.status === 1"
              @click="updateProdStatus(record._id, record.status)"
            >
              {{ record.status === 1 ? '下架' : '上架' }}
            </a-button>
            <br />
            {{ record.status === 1 ? '在售' : '已下架' }}
          </div>
        </template>
        <template v-else-if="column.key === 'opera'">
          <div>
            <a-button type="link" :style="{ color: PRIMARY }" @click="showDetail(record._id)">
              详情
            </a-button>
            <br />
            <a-button type="link" :style="{ color: PRIMARY }" @click="showUpdate(record._id)">
              修改
            </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
</template>
