<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

let ws: WebSocket | null = null;

onMounted(() => {
  ws = new WebSocket('ws://localhost:3001');
  ws.onopen = () => console.log('WebSocket 已连接');
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('收到消息:', data);
    } catch {
      console.log('收到非 JSON 消息:', event.data);
    }
  };
  ws.onclose = (event) => console.log('WebSocket 已关闭', event.code);
  ws.onerror = (error) => console.error('WebSocket 错误:', error);
});

onUnmounted(() => {
  ws?.close(1000, '组件卸载');
});
</script>

<template>
  <div>Bar</div>
</template>
