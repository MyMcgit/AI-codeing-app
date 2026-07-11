<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const we = ref(404);

onMounted(() => {
  if (route.path === '/1') {
    console.log(333);
  }
});
</script>

<template>
  <div>{{ we }}</div>
</template>
