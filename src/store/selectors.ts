import { useAppStore } from './index';

// 细粒度选择器 — 组件只订阅需要的字段，避免不必要的重新渲染

/** 获取完整的 userInfo 对象 */
export const useUserInfo = () => useAppStore((s) => s.userInfo);

/** 获取登录状态 */
export const useIsLogin = () => useAppStore((s) => s.userInfo.isLogin);

/** 获取当前用户名 */
export const useUsername = () => useAppStore((s) => s.userInfo.user?.username);

/** 获取当前用户角色列表 */
export const useUserRole = () => useAppStore((s) => s.userInfo.user?.role);

/** 获取当前用户对象 */
export const useUser = () => useAppStore((s) => s.userInfo.user);

/** 获取页面标题 */
export const useTitle = () => useAppStore((s) => s.title);

/** 获取缓存的商品列表 */
export const useProductList = () => useAppStore((s) => s.productList);

/** 获取缓存的分类列表 */
export const useCategoryList = () => useAppStore((s) => s.categoryList);
