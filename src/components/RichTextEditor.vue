<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps<{
  richtext: string;
}>();

const emit = defineEmits<{
  'update:richtext': [value: string];
}>();
</script>

<template>
  <div class="rich-editor">
    <QuillEditor
      :content="richtext"
      content-type="html"
      theme="snow"
      toolbar="full"
      @update:content="(val: string) => emit('update:richtext', val)"
    />
  </div>
</template>

<style scoped lang="scss">
.rich-editor {
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
