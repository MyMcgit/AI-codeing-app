<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { reqweather } from '@/api';
import dayjs from 'dayjs';
import menuConfig from '@/config/menu';
import type { MenuItemConfig } from '@/config/menu';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';

const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();

const isFull = ref(false);
const time = ref(dayjs().format('YYYY年 MM月DD日 HH:mm:ss'));
const weather = ref<Record<string, string>>({});
const pathTitle = ref('');
let timer: ReturnType<typeof setInterval> | null = null;

function getPathTitle(path: string, list: MenuItemConfig[]) {
  list.forEach((item) => {
    if (item.children) {
      getPathTitle(path, item.children);
    } else if (path.split('/').reverse()[0] === item.key) {
      pathTitle.value = item.title;
    }
  });
}

onMounted(async () => {
  try {
    const res: any = await reqweather();
    weather.value = res.lives?.[0] || {};
  } catch { /* ignore */ }

  document.addEventListener('fullscreenchange', () => {
    isFull.value = !!document.fullscreenElement;
  });

  timer = setInterval(() => {
    time.value = dayjs().format('YYYY年 MM月DD日 HH:mm:ss');
  }, 1000);

  getPathTitle(route.path.split('/').reverse()[0], menuConfig);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function logout() {
  Modal.confirm({
    title: '确定退出？',
    content: '若退出需要重新登录',
    cancelText: '取消',
    okText: '确定',
    onOk() {
      authStore.deleteUserInfo();
    },
  });
}
</script>

<template>
  <header class="header-bar">
    <div class="header_top">
      <a-button size="small" @click="toggleFullscreen">
        <FullscreenExitOutlined v-if="isFull" />
        <FullscreenOutlined v-else />
      </a-button>
      <span class="username">欢迎，{{ authStore.user?.username }}</span>
      <a-button type="link" class="logout-btn" @click="logout">退出登录</a-button>
    </div>
    <div class="header_bottom">
      <div class="header_bottom_left">{{ appStore.title || pathTitle }}</div>
      <div class="header_bottom_right">
        {{ time }}
        &nbsp;&nbsp;&nbsp;
        {{ weather.weather }} &nbsp;&nbsp;&nbsp;{{ weather.temperature }}℃
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-bar {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 16px;
  .header_top {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 0;
    gap: 8px;
    .username {
      font-size: 14px;
    }
    .logout-btn {
      color: #999;
    }
  }
  .header_bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    .header_bottom_left {
      font-size: 20px;
      font-weight: bold;
    }
    .header_bottom_right {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
