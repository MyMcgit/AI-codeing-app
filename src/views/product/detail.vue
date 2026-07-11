<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { PRIMARY } from '@/config';
import { reqProdById, reqCategoryList } from '@/api';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const pid = route.params.pid as string;
const prodInfo = ref<{ name: string; content: any }[]>([]);
const isLoading = ref(true);

async function getProdById(id: string) {
  const cateList: any = await getCateByReq();
  const result: any = await reqProdById(id);
  const { code, data } = result;
  if (code === 0) {
    prodInfo.value = [
      { name: '商品名称', content: data.name },
      { name: '商品描述', content: data.desc },
      { name: '商品价格', content: '￥' + data.price },
      {
        name: '所属分类',
        content: cateList?.find((item: any) => item._id === data.categoryid)?.name,
      },
      {
        name: '商品图片',
        content: data.imgs?.map((item: string) => ({ type: 'img', src: `/api1/upload/${item}` })),
      },
      { name: '商品详情', content: { type: 'html', value: data.detail } },
    ];
  } else {
    message.error('获取数据失败');
  }
}

async function getCateByReq() {
  const result: any = await reqCategoryList();
  const { data, code, msg } = result;
  if (code === 0) {
    isLoading.value = false;
    return data;
  } else {
    message.error(msg);
  }
}

onMounted(() => {
  if (appStore.productList.length) {
    const info = appStore.productList.find((item) => String(item._id) === pid);
    const cateName = appStore.categoryList.find((item) => item._id === info?.categoryid)?.name;
    isLoading.value = false;
    prodInfo.value = [
      { name: '商品名称', content: info?.name },
      { name: '商品描述', content: info?.desc },
      { name: '商品价格', content: '￥' + info?.price },
      { name: '所属分类', content: cateName },
      {
        name: '商品图片',
        content: info?.imgs?.map((item: string) => ({ type: 'img', src: `/api1/upload/${item}` })),
      },
      { name: '商品详情', content: { type: 'html', value: info?.detail } },
    ];
  } else {
    getProdById(pid);
  }
});
</script>

<template>
  <a-card :loading="isLoading">
    <template #title>
      <div style="display: flex; align-items: center;">
        <a-button type="link" @click="router.back()">
          <ArrowLeftOutlined :style="{ color: PRIMARY }" />
        </a-button>
        <span>商品详情</span>
      </div>
    </template>
    <a-list
      bordered
      :data-source="prodInfo"
      :split="true"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <div style="display: flex; padding: 8px 0;">
            <span style="font-weight: bold; min-width: 100px;">{{ item.name }}：</span>
            <template v-if="Array.isArray(item.content) && item.content[0]?.type === 'img'">
              <span style="display: flex; gap: 8px; flex-wrap: wrap;">
                <img
                  v-for="img in item.content"
                  :key="img.src"
                  :src="img.src"
                  style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;"
                  alt=""
                />
              </span>
            </template>
            <template v-else-if="typeof item.content === 'object' && item.content?.type === 'html'">
              <span v-html="item.content.value"></span>
            </template>
            <template v-else>
              <span>{{ item.content }}</span>
            </template>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
