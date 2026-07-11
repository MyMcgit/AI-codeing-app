import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ProductItem, CategoryItem } from '@/types';

function cloneDeep<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const useAppStore = defineStore('app', () => {
  const title = ref('');
  const productList = ref<ProductItem[]>([]);
  const categoryList = ref<CategoryItem[]>([]);

  function setTitle(val: string) {
    title.value = val;
  }

  function setProductList(list: ProductItem[]) {
    productList.value = cloneDeep(list);
  }

  function setCategoryList(list: CategoryItem[]) {
    categoryList.value = cloneDeep(list);
  }

  return { title, productList, categoryList, setTitle, setProductList, setCategoryList };
});
