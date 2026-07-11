<script setup lang="ts">
import { ref, onMounted } from 'vue';

const str = ref([1, 2, 3]);

onMounted(() => {
  setTimeout(() => {
    str.value[2] = 5;
    console.log(5);
  }, 3000);
});
</script>

<template>
  <div>{{ str.toString() }}</div>
</template>
