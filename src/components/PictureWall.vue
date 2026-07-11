<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadFile, UploadChangeParam } from 'ant-design-vue';
import { reqDeletePicture } from '@/api';

const props = defineProps<{
  preimgs: string[];
  setPreImgs: (imgs: string[]) => void;
}>();

const fileList = ref<UploadFile[]>([]);
const previewOpen = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

async function handlePreview(file: UploadFile) {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj as File);
  }
  previewImage.value = file.url || (file.preview as string) || '';
  previewOpen.value = true;
  previewTitle.value = file.name || '';
}

function handleChange({ file, fileList: newFileList }: UploadChangeParam) {
  if (file.status === 'done' && file.response) {
    newFileList[newFileList.length - 1].name = file.response;
  }
  const arr = newFileList.map((item) => item.name || '');
  props.setPreImgs(arr);
  fileList.value = newFileList;
  if (file.status === 'removed') {
    deletePic(file.name || '');
  }
}

async function deletePic(name: string) {
  const result: any = await reqDeletePicture(name);
  if (result.code === 0) {
    message.success('图片删除成功');
  }
}

function setFileList(files: UploadFile[]) {
  fileList.value = files;
}

defineExpose({ setFileList });
</script>

<template>
  <div>
    <a-upload
      action="/api1/manage/product/addpic"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 8">
        <PlusOutlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal
      :open="previewOpen"
      :title="previewTitle"
      :footer="null"
      @cancel="previewOpen = false"
    >
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
