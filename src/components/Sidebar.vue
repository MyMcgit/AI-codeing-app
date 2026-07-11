<script setup lang="ts">
import { h, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import menuConfig from '@/config/menu';
import type { MenuItemConfig } from '@/config/menu';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

function hasAuth(item: MenuItemConfig): boolean {
  const username = authStore.user?.username;
  const role = authStore.user?.role;
  if (username === 'admin' && role) return true;
  if (!item.children && role) return role.includes(item.key);
  if (item.children && role) {
    return !!item.children.find((child) => role.includes(child.key));
  }
  return false;
}

function buildMenu(menuArr: MenuItemConfig[] | undefined): any[] {
  if (!menuArr) return [];
  return menuArr
    .filter(hasAuth)
    .map((item) => ({
      key: item.key,
      icon: item.icon ? () => h(item.icon) : undefined,
      label: item.title,
      children: item.children ? buildMenu(item.children) : undefined,
    }));
}

// 响应式菜单项 — 随 authStore.user 变化自动更新
const items = computed(() => buildMenu(menuConfig));

// 响应式高亮
const selectedKeys = computed(() => {
  const path = route.path;
  if (path.includes('product')) return ['product'];
  return [path.split('/').reverse()[0]];
});

// 展开的菜单组
const openKeys = computed(() => {
  const parts = route.path.split('/');
  // 获取 /admin/prod_about/product 中的 ['prod_about']
  // 两级路径如 /admin/prod_about/product → 展开 prod_about
  // 三级路径如 /admin/charts/bar → 展开 charts
  if (parts.length >= 3) return [parts[2]];
  return [];
});

function selectItem(info: { key: string; keyPath: string[]; domEvent: MouseEvent }) {
  const { key } = info;
  appStore.setTitle((info.domEvent.target as HTMLElement)?.innerText || '');
  // 菜单 key 与路由 name 一致，直接用命名路由跳转
  router.push({ name: key });
}
</script>

<template>
  <div class="sidebar">
    <header class="nav_header">
      <img src="/wer.png" alt="logo" />
      <h1>商品管理系统</h1>
    </header>
    <a-menu
      :selected-keys="selectedKeys"
      :open-keys="openKeys"
      mode="inline"
      theme="dark"
      :items="items"
      @select="selectItem"
    />
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  .nav_header {
    display: flex;
    align-items: center;
    padding: 16px;
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    h1 {
      color: #fff;
      font-size: 18px;
      white-space: nowrap;
      margin: 0;
    }
  }
}
</style>
