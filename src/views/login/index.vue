<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { reqLogin } from '@/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const router = useRouter();
const authStore = useAuthStore();

const formModel = reactive({
  username: '',
  password: '',
});

const onFinish = async (values: { username: string; password: string }) => {
  console.log('Received values of form: ', values);
  const result: any = await reqLogin(values);
  console.log(result, 123);
  const { code, msg, data } = result;
  if (code === 0) {
    authStore.saveUserInfo(data);
    router.replace('/admin/home');
    message.success('登录成功！');
  } else {
    message.warning(msg);
  }
};
</script>

<template>
  <div class="login-page">
    <div class="bg">
      <header>
        <img src="/wer.png" alt="logo" />
        <h1>商品管理系统</h1>
      </header>
      <section>
        <h1>用户登录</h1>
        <a-form
          name="normal_login"
          class="login-form"
          :model="formModel"
          @finish="onFinish"
        >
          <a-form-item name="username" :rules="[{ required: true, message: '请输入您的用户名!' }, { max: 12, message: '必须小于等于12位' }]">
            <a-input v-model:value="formModel.username" placeholder="用户名">
              <template #prefix>
                <UserOutlined style="color: rgba(0,0,0,.25)" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入您的密码!' }]">
            <a-input-password v-model:value="formModel.password" placeholder="密码">
              <template #prefix>
                <LockOutlined style="color: rgba(0,0,0,.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" class="login-form-button" block>
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  .bg {
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    header {
      text-align: center;
      margin-bottom: 24px;
      img {
        width: 60px;
        height: 60px;
      }
      h1 {
        font-size: 24px;
        margin-top: 8px;
      }
    }
    section h1 {
      text-align: center;
      font-size: 18px;
      margin-bottom: 24px;
      color: #666;
    }
  }
}
</style>
