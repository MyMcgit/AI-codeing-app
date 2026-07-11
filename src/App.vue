<script setup lang="ts">
import { PRIMARY } from '@/config';
</script>

<template>
  <a-config-provider :theme="{ token: { colorPrimary: PRIMARY, borderRadius: 6 } }">
    <router-view />
  </a-config-provider>
</template>
