<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';
import HeaderBar from '@/components/HeaderBar.vue';

const router = useRouter();
const authStore = useAuthStore();
const collapsed = ref(false);

onMounted(() => {
  if (!authStore.isLogin) {
    router.replace('/login');
  }
});
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :width="220" :collapsed-width="80" style="overflow: auto">
      <Sidebar />
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: '0', height: 'auto', lineHeight: 'initial' }">
        <HeaderBar />
      </a-layout-header>
      <a-layout-content :style="{ margin: '16px' }">
        <div :style="{ padding: '24px', background: '#fff', borderRadius: '6px', minHeight: '360px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        推荐使用谷歌浏览器，获取最佳用户体验
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
