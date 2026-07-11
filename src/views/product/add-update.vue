<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { PRIMARY } from '@/config';
import { reqCategoryList, reqAddProduct, reqProdById, reqUpdateProduct } from '@/api';
import { useAppStore } from '@/stores/app';
import PictureWall from '@/components/PictureWall.vue';
import RichTextEditor from '@/components/RichTextEditor.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const pid = (route.params.pid as string) || '';
const isEdit = !!pid;

const categoryList = ref<{ value: string; label: string }[]>([]);
const formRef = ref<any>();
const preImgs = ref<string[]>([]);
const richText = ref('');
const picWallRef = ref<any>(null);

async function getCategoryList() {
  const result: any = await reqCategoryList();
  const { code, data, msg } = result;
  if (code === 0) {
    categoryList.value = data.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
  } else {
    message.error(msg);
  }
}

function fillForm(data: any) {
  formRef.value?.setFieldsValue({
    catename: data.name,
    desc: data.desc,
    price: data.price,
    category: data.categoryid,
  });
  const arr = (data.imgs || []).map((item: string) => ({
    uid: Math.random().toString(),
    name: item,
    status: 'done',
    url: `/api1/upload/${item}`,
  }));
  picWallRef.value?.setFileList(arr);
  richText.value = data.detail || '';
  preImgs.value = data.imgs || [];
}

async function getProduct() {
  const result: any = await reqProdById(pid);
  const { code, data } = result;
  if (code === 0) {
    fillForm(data);
  } else {
    message.error('获取数据失败');
  }
}

onMounted(() => {
  if (appStore.categoryList.length) {
    categoryList.value = appStore.categoryList.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
  } else {
    getCategoryList();
  }

  if (pid) {
    if (appStore.productList.length) {
      const info = appStore.productList.find((item: any) => String(item._id) === pid);
      if (info) {
        fillForm(info);
        return;
      }
    }
    getProduct();
  }
});

async function onFinish(values: any) {
  values.imgs = preImgs.value;
  values.detail = richText.value;
  console.log('Submitted:', values);

  let result: any;
  if (pid) {
    values.id = pid;
    result = await reqUpdateProduct(values);
  } else {
    result = await reqAddProduct(values);
  }

  if (result.code === 0) {
    message.success(pid ? '修改商品成功' : '新增商品成功');
    router.push('/admin/prod_about/product');
  } else {
    message.error('操作失败');
  }
}
</script>

<template>
  <a-card>
    <template #title>
      <div style="display: flex; align-items: center;">
        <a-button type="link" @click="router.back()" style="font-size: 20px;">
          <ArrowLeftOutlined :style="{ color: PRIMARY }" />
        </a-button>
        <span style="font-size: 20px;">{{ isEdit ? '修改商品' : '新增商品' }}</span>
      </div>
    </template>

    <a-form
      ref="formRef"
      name="addUpdate-form"
      :label-col="{ md: 2 }"
      :wrapper-col="{ md: 7 }"
      @finish="onFinish"
    >
      <a-form-item
        label="商品名称"
        name="catename"
        :rules="[{ required: true, message: '请输入商品名称' }]"
      >
        <a-input placeholder="商品名称" />
      </a-form-item>

      <a-form-item
        label="商品描述"
        name="desc"
        :rules="[{ required: true, message: '请输入商品描述' }]"
      >
        <a-input placeholder="商品描述" />
      </a-form-item>

      <a-form-item
        label="商品价格"
        name="price"
        :rules="[{ required: true, message: '请输入商品价格' }]"
      >
        <a-input prefix="￥" suffix="元" type="number" placeholder="商品价格" />
      </a-form-item>

      <a-form-item
        label="商品分类"
        name="category"
        :rules="[{ required: true, message: '请选择商品分类' }]"
      >
        <a-select :options="categoryList" placeholder="请选择分类" />
      </a-form-item>

      <a-form-item label="商品图片" :wrapper-col="{ md: 17 }">
        <PictureWall ref="picWallRef" :preimgs="preImgs" :set-pre-imgs="(v: string[]) => preImgs = v" />
      </a-form-item>

      <a-form-item label="商品详情" :wrapper-col="{ md: 17 }">
        <RichTextEditor v-model:richtext="richText" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
