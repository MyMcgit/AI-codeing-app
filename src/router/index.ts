import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/index.vue'),
    redirect: '/admin/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'prod_about/category',
        name: 'category',
        component: () => import('@/views/category/index.vue'),
      },
      {
        path: 'prod_about/product',
        name: 'product',
        component: () => import('@/views/product/index.vue'),
        children: [
          {
            path: 'detail/:pid',
            name: 'product-detail',
            component: () => import('@/views/product/detail.vue'),
          },
          {
            path: 'addupdate',
            name: 'product-add',
            component: () => import('@/views/product/add-update.vue'),
          },
          {
            path: 'addupdate/:pid',
            name: 'product-edit',
            component: () => import('@/views/product/add-update.vue'),
          },
        ],
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/index.vue'),
      },
      {
        path: 'charts/bar',
        name: 'bar',
        component: () => import('@/views/charts/bar.vue'),
      },
      {
        path: 'charts/line',
        name: 'line',
        component: () => import('@/views/charts/line.vue'),
      },
      {
        path: 'charts/pie',
        name: 'pie',
        component: () => import('@/views/charts/pie.vue'),
      },
    ],
  },
  {
    path: '/',
    redirect: '/admin',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：未登录跳转登录页
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.path !== '/login' && !authStore.isLogin) {
    next('/login');
  } else {
    next();
  }
});

export default router;
